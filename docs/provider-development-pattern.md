# Provider Development Pattern

## Overview

This document defines the development pattern and architecture for implementing provider services (LeetCode, GFG, etc.) in the DSA Solver application.

---

## Architecture Pattern

### 1. **Abstract Base Class Pattern**

All provider services extend a common `BaseProviderService` class that provides:
- Shared browser management (Puppeteer)
- Common utility functions (waitForElement, extractText, etc.)
- Error handling and cleanup
- Abstract methods that each provider must implement

### 2. **Factory Pattern**

A `ProviderFactory` creates the appropriate provider instance based on `ProviderType`, ensuring type safety and easy extensibility.

### 3. **Credential Management**

Credentials are stored encrypted in the database and decrypted only when needed for provider operations.

---

## File Structure

```
lib/
├── provider-service/
│   ├── base-provider.service.ts      # Abstract base class
│   ├── leetcode.service.ts            # LeetCode implementation
│   ├── gfg.service.ts                # GFG implementation
│   ├── provider-factory.ts            # Factory for creating providers
│   └── index.ts                      # Exports all services
│
├── credential-service/
│   ├── credential.service.ts          # Encryption/decryption service
│   └── index.ts
│
interface/
└── provider.interface.ts              # TypeScript interfaces

app/api/
├── protected/
│   ├── providers/
│   │   ├── route.ts                  # GET: List user's providers
│   │   ├── route.ts                  # POST: Create new provider config
│   │   └── [providerId]/
│   │       ├── route.ts              # GET, PUT, DELETE: Manage provider
│   │       ├── credentials/
│   │       │   └── route.ts          # POST: Update credentials
│   │       └── test/
│   │           └── route.ts          # POST: Test provider connection
│   └── providers/[providerType]/
│       └── scrape/
│           └── route.ts              # POST: Manual scrape daily question
```

---

## Development Flow

### Phase 1: Core Infrastructure

#### Step 1.1: Create Interfaces
**File:** `interface/provider.interface.ts`

```typescript
import { ProviderType } from "@prisma/client";

export interface Credentials {
  email: string;
  password: string;
}

export interface Problem {
  id: string;
  slug: string;
  problemUrl: string;
  title: string;
  difficulty: string;
  topics: string[];
  description?: string;
  examples?: any[];
  constraints?: string;
  isPremium?: boolean;
  provider: ProviderType;
  problemDate: Date;
}
```

#### Step 1.2: Create Credential Service
**File:** `lib/credential-service/credential.service.ts`

**Purpose:** Handle encryption/decryption of provider credentials

**Key Functions:**
- `encryptCredentials(email: string, password: string): EncryptedData`
- `decryptCredentials(encryptedData: EncryptedData): Credentials`
- `getCredentials(providerConfigId: string): Promise<Credentials>`

**Usage:**
```typescript
// Encrypt before storing
const encrypted = await credentialService.encryptCredentials(email, password);
await prisma.encryptedCredentials.create({ data: encrypted });

// Decrypt when needed
const credentials = await credentialService.getCredentials(providerConfigId);
```

#### Step 1.3: Create Base Provider Service
**File:** `lib/provider-service/base-provider.service.ts`

**Purpose:** Abstract base class with common functionality

**Key Features:**
- Browser initialization and cleanup
- Shared utility methods (waitForElement, extractText, etc.)
- Error handling and retry logic
- Abstract methods: `login()`, `scrapeDailyQuestion()`

**Abstract Methods (Must Implement):**
```typescript
abstract login(credentials: Credentials): Promise<boolean>;
abstract scrapeDailyQuestion(): Promise<Problem>;
```

#### Step 1.4: Create Provider Factory
**File:** `lib/provider-service/provider-factory.ts`

**Purpose:** Factory to create provider instances

**Key Functions:**
- `create(providerType: ProviderType): IProviderService`
- `getSupportedProviders(): ProviderType[]`
- `isSupported(providerType: ProviderType): boolean`

---

### Phase 2: Provider Implementations

#### Step 2.1: LeetCode Service
**File:** `lib/provider-service/leetcode.service.ts`

**Implementation Pattern:**
1. Extend `BaseProviderService`
2. Define LeetCode-specific constants (BASE_URL, selectors)
3. Implement `login()` with LeetCode-specific logic
4. Implement `scrapeDailyQuestion()` with LeetCode-specific scraping

**Key Points:**
- Use LeetCode-specific selectors and URLs
- Handle LeetCode's authentication flow
- Extract LeetCode's daily challenge structure
- Map LeetCode data to our `Problem` interface

#### Step 2.2: GFG Service
**File:** `lib/provider-service/gfg.service.ts`

**Same pattern as LeetCode but with GFG-specific:**
- Base URL
- Selectors
- Authentication flow
- Problem structure

---

### Phase 3: API Routes

#### Step 3.1: Provider Configuration APIs

**GET `/api/protected/providers`**
- List all provider configs for authenticated user
- Returns: `ProviderConfig[]` with credentials excluded

**POST `/api/protected/providers`**
- Create new provider configuration
- Body: `{ provider: ProviderType, credentials: Credentials }`
- Encrypts credentials before storing
- Creates `ProviderConfig` and `EncryptedCredentials` records

**GET `/api/protected/providers/[providerId]`**
- Get specific provider configuration
- Returns: `ProviderConfig` (credentials excluded)

**PUT `/api/protected/providers/[providerId]`**
- Update provider configuration (isActive, notificationConfig)
- Does NOT update credentials (use separate endpoint)

**DELETE `/api/protected/providers/[providerId]`**
- Delete provider configuration
- Cascades to `EncryptedCredentials` and `NotificationConfig`

#### Step 3.2: Credential Management APIs

**POST `/api/protected/providers/[providerId]/credentials`**
- Update credentials for existing provider
- Body: `{ email: string, password: string }`
- Encrypts and updates `EncryptedCredentials`

#### Step 3.3: Provider Testing APIs

**POST `/api/protected/providers/[providerId]/test`**
- Test provider connection/login
- Uses `ProviderFactory` to create service
- Decrypts credentials
- Calls `provider.login(credentials)`
- Returns: `{ success: boolean, message: string }`

**POST `/api/protected/providers/[providerType]/scrape`**
- Manually trigger daily question scraping
- Uses `ProviderFactory` to create service
- Calls `provider.scrapeDailyQuestion()`
- Stores result in `DailyQuestion` table
- Returns: `Problem` object

---

## Usage Flow Examples

### Example 1: User Configures LeetCode Provider

```typescript
// 1. User submits form with email/password
const formData = { provider: "LEETCODE", email: "...", password: "..." };

// 2. API route encrypts credentials
const encrypted = await credentialService.encryptCredentials(
  formData.email,
  formData.password
);

// 3. Store in database
await prisma.providerConfig.create({
  data: {
    userId: user.id,
    provider: ProviderType.LEETCODE,
    credentials: {
      create: encrypted
    },
    notificationConfig: {
      create: { /* defaults */ }
    }
  }
});
```

### Example 2: Test Provider Connection

```typescript
// 1. Get provider config
const config = await prisma.providerConfig.findUnique({
  where: { id: providerId },
  include: { credentials: true }
});

// 2. Decrypt credentials
const credentials = await credentialService.decryptCredentials(
  config.credentials
);

// 3. Create provider service
const provider = ProviderFactory.create(config.provider);

// 4. Test login
const loginSuccess = await provider.login(credentials);

// 5. Return result
return { success: loginSuccess, message: loginSuccess ? "Connected" : "Failed" };
```

### Example 3: Scrape Daily Question (Background Job)

```typescript
// 1. Get all active provider configs
const configs = await prisma.providerConfig.findMany({
  where: { isActive: true },
  include: { credentials: true }
});

// 2. For each provider
for (const config of configs) {
  try {
    // 3. Create provider service
    const provider = ProviderFactory.create(config.provider);
    
    // 4. Scrape daily question (no login needed for public scraping)
    const problem = await provider.scrapeDailyQuestion();
    
    // 5. Store in database
    await prisma.dailyQuestion.upsert({
      where: {
        provider_problemDate: {
          provider: config.provider,
          problemDate: problem.problemDate
        }
      },
      create: {
        provider: config.provider,
        problemId: problem.id,
        problemSlug: problem.slug,
        problemUrl: problem.problemUrl,
        title: problem.title,
        difficulty: problem.difficulty,
        topics: problem.topics,
        description: problem.description,
        problemDate: problem.problemDate,
        scrapedAt: new Date()
      },
      update: {
        title: problem.title,
        difficulty: problem.difficulty,
        topics: problem.topics,
        description: problem.description,
        scrapedAt: new Date()
      }
    });
  } catch (error) {
    console.error(`Failed to scrape ${config.provider}:`, error);
  }
}
```

---

## Key Design Decisions

### 1. **Why Abstract Base Class?**
- **Reusability**: Common browser management code shared across providers
- **Consistency**: All providers follow the same interface
- **Maintainability**: Bug fixes in base class benefit all providers

### 2. **Why Factory Pattern?**
- **Type Safety**: Ensures correct provider instance creation
- **Extensibility**: Easy to add new providers
- **Centralized**: Single place to manage provider creation

### 3. **Why Separate Credential Service?**
- **Security**: Centralized encryption/decryption logic
- **Reusability**: Can be used by other services
- **Testability**: Easy to mock for testing

### 4. **Why Store Credentials Encrypted?**
- **Security**: Passwords never stored in plain text
- **Compliance**: Best practice for credential storage
- **Privacy**: Protects user data

### 5. **Why Separate Test Endpoint?**
- **User Experience**: Users can verify credentials before saving
- **Error Handling**: Catch issues early
- **Debugging**: Easier to troubleshoot connection problems

---

## Error Handling Strategy

### Provider Service Errors

```typescript
try {
  await provider.scrapeDailyQuestion();
} catch (error) {
  // Log error with context
  console.error(`[${providerType}] Scraping failed:`, error);
  
  // Cleanup browser
  await provider.closeBrowser();
  
  // Throw user-friendly error
  throw new Error(`Failed to scrape ${providerType}: ${error.message}`);
}
```

### API Route Errors

```typescript
try {
  // Provider operation
} catch (error) {
  return NextResponse.json(
    {
      success: false,
      message: error.message || "Provider operation failed",
      error: "PROVIDER_ERROR",
      statusCode: 500
    },
    { status: 500 }
  );
}
```

---

## Testing Strategy

### Unit Tests
- Test credential encryption/decryption
- Test provider factory creation
- Test base provider utilities

### Integration Tests
- Test provider login flow
- Test daily question scraping
- Test error handling

### Manual Testing
- Test with real LeetCode/GFG accounts
- Verify scraping accuracy
- Test error scenarios (invalid credentials, network issues)

---

## Future Enhancements

1. **Caching**: Cache daily questions to avoid redundant scraping
2. **Rate Limiting**: Implement rate limiting per provider
3. **Retry Logic**: Automatic retry for failed scraping attempts
4. **Webhooks**: Notify users when daily questions are scraped
5. **Analytics**: Track scraping success rates per provider
6. **Multiple Providers**: Support scraping from multiple providers simultaneously

---

## Summary

**Development Order:**
1. ✅ Interfaces (`provider.interface.ts`)
2. ✅ Credential Service (`credential.service.ts`)
3. ✅ Base Provider Service (`base-provider.service.ts`)
4. ✅ Provider Factory (`provider-factory.ts`)
5. ✅ LeetCode Service (`leetcode.service.ts`)
6. ✅ GFG Service (`gfg.service.ts`)
7. ✅ API Routes (Provider management, testing, scraping)

**Key Principles:**
- **Separation of Concerns**: Each service has a single responsibility
- **Type Safety**: TypeScript interfaces ensure type safety
- **Security**: Credentials always encrypted
- **Extensibility**: Easy to add new providers
- **Error Handling**: Comprehensive error handling at all levels

This pattern ensures consistency, maintainability, and scalability as we add more providers in the future.

