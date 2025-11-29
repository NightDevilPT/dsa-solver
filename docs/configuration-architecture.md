# Configuration Architecture

## Overview

A streamlined configuration system with two core components:

1. **ProviderService** - Service definitions per provider (admin-controlled)
2. **UserProviderService** - User's service configuration with notification preferences (per user, per service)

---

## Architecture

### 1. ProviderService (Service Definitions per Provider)

**Purpose**: Define service metadata for each provider. Admin-controlled service definitions that determine what services are available for each provider (LeetCode, GFG, etc.). Used in the frontend to display service cards/buttons.

**Database Model**: `ProviderService`

-   One record per service per provider
-   Contains UI metadata (name, description, imageUrl, etc.)
-   Each service is tied to a specific provider
-   Used to display services in provider dashboard

**Prisma Schema**:

```prisma
// prisma/providerService.prisma
model ProviderService {
  id                String       @id @default(cuid())
  name              String       // Display name: "Daily Challenge"
  description       String       // Description: "Get daily coding problems with solutions"
  imageUrl          String?      // Image URL for service card: "/images/daily-challenge.svg"
  providerType      ProviderType // LEETCODE, GFG, etc.
  serviceType       String       // Service type identifier: "DAILY_CHALLENGE", "FILTER_CHALLENGE", "WEEKLY_CHALLENGE", "CONTEST_REMINDERS"
  serviceConfigSchema Json?      // JSON schema defining the structure of serviceConfig for this service
  order             Int          @default(0)  // Display order
  isActive          Boolean      @default(true)  // Admin can enable/disable
  isComingSoon      Boolean      @default(false)
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  // Relations
  userProviderServices UserProviderService[]

  @@unique([name, providerType])
  @@index([providerType])
  @@index([isActive])
  @@index([serviceType])
}
```

**Note**: The `serviceConfigSchema` field defines what structure the `serviceConfig` JSON should have for this specific service. This allows the frontend to render appropriate form fields based on the service type.

**Example Data**:

```json
[
	{
		"id": "ps_001",
		"name": "Daily Challenge",
		"description": "Get your daily LeetCode problem with AI-generated solutions and explanations",
		"imageUrl": "/images/services/daily-challenge.svg",
		"providerType": "LEETCODE",
		"serviceType": "DAILY_CHALLENGE",
		"serviceConfigSchema": {
			"type": "object",
			"properties": {
				"autoFetch": { "type": "boolean", "default": true },
				"preferredTime": { "type": "string", "format": "time", "default": "09:00" },
				"timezone": { "type": "string", "default": "UTC" },
				"skipWeekends": { "type": "boolean", "default": false },
				"skipPremium": { "type": "boolean", "default": true },
				"fetchOnStartup": { "type": "boolean", "default": false }
			}
		},
		"order": 1,
		"isActive": true,
		"isComingSoon": false,
		"createdAt": "2025-01-15T10:00:00Z",
		"updatedAt": "2025-01-15T10:00:00Z"
	},
	{
		"id": "ps_002",
		"name": "Daily Challenge",
		"description": "Get your daily GFG problem with AI-generated solutions and explanations",
		"imageUrl": "/images/services/daily-challenge.svg",
		"providerType": "GFG",
		"serviceType": "DAILY_CHALLENGE",
		"serviceConfigSchema": {
			"type": "object",
			"properties": {
				"autoFetch": { "type": "boolean", "default": true },
				"preferredTime": { "type": "string", "format": "time", "default": "09:00" },
				"timezone": { "type": "string", "default": "UTC" },
				"skipWeekends": { "type": "boolean", "default": false },
				"skipPremium": { "type": "boolean", "default": true },
				"fetchOnStartup": { "type": "boolean", "default": false }
			}
		},
		"order": 1,
		"isActive": true,
		"isComingSoon": false,
		"createdAt": "2025-01-15T10:00:00Z",
		"updatedAt": "2025-01-15T10:00:00Z"
	},
	{
		"id": "ps_003",
		"name": "Filter Challenge",
		"description": "Get filtered LeetCode problems based on difficulty, topics, and more",
		"imageUrl": "/images/services/filter-challenge.svg",
		"providerType": "LEETCODE",
		"serviceType": "FILTER_CHALLENGE",
		"serviceConfigSchema": {
			"type": "object",
			"properties": {
				"numberOfQuestions": { "type": "number", "default": 5, "minimum": 1, "maximum": 50 },
				"difficulties": { "type": "array", "items": { "type": "string", "enum": ["EASY", "MEDIUM", "HARD"] } },
				"topics": { "type": "array", "items": { "type": "string" } },
				"questionTypes": { "type": "array", "items": { "type": "string" } },
				"scheduleTime": { "type": "string", "format": "time", "default": "08:00" },
				"autoFetch": { "type": "boolean", "default": true },
				"timezone": { "type": "string", "default": "UTC" },
				"excludeSolved": { "type": "boolean", "default": true },
				"minRating": { "type": "number", "minimum": 0 },
				"maxRating": { "type": "number" },
				"tags": { "type": "array", "items": { "type": "string" } },
				"sortBy": { "type": "string", "enum": ["DIFFICULTY", "RATING", "ACCEPTANCE_RATE"] },
				"sortOrder": { "type": "string", "enum": ["ASC", "DESC"] }
			}
		},
		"order": 2,
		"isActive": true,
		"isComingSoon": false,
		"createdAt": "2025-01-15T10:00:00Z",
		"updatedAt": "2025-01-15T10:00:00Z"
	},
	{
		"id": "ps_004",
		"name": "Weekly Challenge",
		"description": "Participate in weekly coding challenges",
		"imageUrl": "/images/services/weekly-challenge.svg",
		"providerType": "LEETCODE",
		"serviceType": "WEEKLY_CHALLENGE",
		"serviceConfigSchema": {
			"type": "object",
			"properties": {
				"autoFetch": { "type": "boolean", "default": true },
				"preferredDay": { "type": "string", "enum": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] },
				"preferredTime": { "type": "string", "format": "time", "default": "09:00" },
				"timezone": { "type": "string", "default": "UTC" },
				"includePastChallenges": { "type": "boolean", "default": false },
				"notifyBeforeStart": { "type": "boolean", "default": true },
				"notifyBeforeStartHours": { "type": "number", "default": 24 }
			}
		},
		"order": 3,
		"isActive": false,
		"isComingSoon": true,
		"createdAt": "2025-01-15T10:00:00Z",
		"updatedAt": "2025-01-15T10:00:00Z"
	}
]
```

**Frontend Usage**:

-   Fetch all `ProviderService` where `providerType = [provider]` and `isActive = true`
-   Display service cards with name, description, imageUrl
-   When user clicks a service, navigate to service page to configure it
-   Use `order` to sort services in UI

**Example Frontend Component**:

```typescript
// Get services for a specific provider
const services = await getProviderServices(providerType);

// Filter active services
const activeServices = services.filter((service) => service.isActive);

// Display service cards
{
	activeServices
		.sort((a, b) => a.order - b.order)
		.map((service) => (
			<ServiceCard
				key={service.id}
				name={service.name}
				description={service.description}
				imageUrl={service.imageUrl}
				onClick={() =>
					router.push(
						`/dashboard/providers/${providerType}/services/${service.id}`
					)
				}
			/>
		));
}
```

---

### 2. UserProviderService (User Configuration per Service)

**Purpose**: Per-user, per-service configuration. When a user navigates to a service page, they can configure notifications and settings for that specific service. Each record links a user to a ProviderService with notification preferences.

**Database Model**: `UserProviderService`

-   One record per user, per ProviderService
-   Contains notification configuration (notificationJson)
-   Links user to a specific ProviderService
-   Stores user's service preferences

**Prisma Schema**:

```prisma
// prisma/userProviderService.prisma
model UserProviderService {
  id                String            @id @default(cuid())
  userId            String
  providerServiceId String            // Reference to ProviderService
  isEnabled         Boolean           @default(false)  // User enables/disables this service
  serviceConfig     Json?             // Service-specific settings (optional)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerService   ProviderService   @relation(fields: [providerServiceId], references: [id], onDelete: Cascade)
  notificationConfig NotificationConfig?  // One-to-one relation with NotificationConfig

  @@unique([userId, providerServiceId])
  @@index([userId])
  @@index([providerServiceId])
  @@index([isEnabled])
}
```

**NotificationConfig Model** (Updated to link to UserProviderService and match Problem model structure):

```prisma
// prisma/notificationConfig.prisma
model NotificationConfig {
  id                 String   @id @default(cuid())
  userProviderServiceId String   @unique  // Reference to UserProviderService (instead of ProviderConfig)
  enabled            Boolean  @default(false)  // Whether notifications are enabled
  
  // Email Configuration
  mailSubject        String?  // Email subject line (supports variables like {problemTitle}, {numberOfQuestions}, {contestName})
  emailFrequency     String   @default("DAILY")  // DAILY, WEEKLY, INSTANT
  preferredTime      String?  // Time in HH:mm format (e.g., "09:00") - null for INSTANT
  
  // Solutions Configuration (matches Problem.solutions structure)
  includeBruteForce  Boolean  @default(false)  // Include solutions.bruteForce (code + explanation)
  includeOptimized   Boolean  @default(false)  // Include solutions.optimized (code + explanation)
  includeBestPractice Boolean @default(false)  // Include solutions.bestPractice (code + explanation)
  includeAlternative Boolean  @default(false)  // Include solutions.alternative[] (array of alternative solutions)
  
  // Explanations Configuration (matches Problem.explanations structure)
  includeExplanationOverview Boolean @default(false)  // Include explanations.overview
  includeExplanationApproach Boolean @default(false)  // Include explanations.approach
  includeStepByStep  Boolean  @default(false)  // Include explanations.stepByStep[]
  includeKeyInsights Boolean  @default(false)  // Include explanations.keyInsights[]
  includeCommonMistakes Boolean @default(false)  // Include explanations.commonMistakes[]
  includeRelatedProblems Boolean @default(false)  // Include explanations.relatedProblems[]
  
  // Hints Configuration (matches Problem.hints structure)
  includeHintsProgressive Boolean @default(false)  // Include hints.progressive[] (array of progressive hints)
  includeHintsApproach Boolean @default(false)  // Include hints.approach
  includeHintsDataStructure Boolean @default(false)  // Include hints.dataStructure
  includeHintsAlgorithm Boolean @default(false)  // Include hints.algorithm
  
  // Auto-Submit Configuration
  autoSubmit         Boolean  @default(false)
  autoSubmitTime     String?  // Time in HH:mm format (e.g., "10:00") - Required when autoSubmit is true
  autoSubmitOnlyIfSolved Boolean @default(true)  // Only submit if problem is solved
  autoSubmitSendConfirmation Boolean @default(true)  // Send confirmation email after submission
  autoSubmitConfirmationSubject String?  // Subject for confirmation email (supports variables like {problemTitle})
  preferredLanguage  String   @default("python")  // Preferred programming language for auto-submit
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  userProviderService UserProviderService @relation(fields: [userProviderServiceId], references: [id], onDelete: Cascade)
}
```

**NotificationConfig Fields Explained** (Aligned with Problem Model Structure):

**Email Configuration**:
-   `enabled`: Whether notifications are enabled for this service
-   `mailSubject`: Email subject line (supports variables like `{problemTitle}`, `{numberOfQuestions}`, `{contestName}`)
-   `emailFrequency`: When to send (DAILY, WEEKLY, INSTANT)
-   `preferredTime`: Preferred time to send (HH:mm format, e.g., "09:00") - null for INSTANT

**Solutions Configuration** (maps to `Problem.solutions` JSON field):
-   `includeBruteForce`: Include `solutions.bruteForce` (includes code, explanation, complexity, stepByStep)
-   `includeOptimized`: Include `solutions.optimized` (includes code, explanation, complexity, stepByStep)
-   `includeBestPractice`: Include `solutions.bestPractice` (includes code, explanation, complexity, stepByStep)
-   `includeAlternative`: Include `solutions.alternative[]` (array of alternative solution approaches)

**Explanations Configuration** (maps to `Problem.explanations` JSON field):
-   `includeExplanationOverview`: Include `explanations.overview` (high-level problem understanding)
-   `includeExplanationApproach`: Include `explanations.approach` (main strategy/algorithm used)
-   `includeStepByStep`: Include `explanations.stepByStep[]` (detailed step-by-step explanation)
-   `includeKeyInsights`: Include `explanations.keyInsights[]` (important insights or patterns)
-   `includeCommonMistakes`: Include `explanations.commonMistakes[]` (common errors students make)
-   `includeRelatedProblems`: Include `explanations.relatedProblems[]` (similar problems with links)

**Hints Configuration** (maps to `Problem.hints` JSON field):
-   `includeHintsProgressive`: Include `hints.progressive[]` (array of progressive hints from subtle to direct)
-   `includeHintsApproach`: Include `hints.approach` (general approach hint)
-   `includeHintsDataStructure`: Include `hints.dataStructure` (suggested data structure)
-   `includeHintsAlgorithm`: Include `hints.algorithm` (suggested algorithm/technique)

**Auto-Submit Configuration**:
-   `autoSubmit`: Whether to auto-submit solutions
-   `autoSubmitTime`: Time to submit (HH:mm format, e.g., "10:00") - Required when `autoSubmit` is true
-   `autoSubmitOnlyIfSolved`: Only submit if problem is solved
-   `autoSubmitSendConfirmation`: Send email confirmation after submission
-   `autoSubmitConfirmationSubject`: Subject for confirmation email (supports variables like `{problemTitle}`)
-   `preferredLanguage`: Preferred programming language for auto-submit (e.g., "python", "java", "cpp", "typescript")

**serviceConfig Types** (Service-specific settings - optional JSON field):

The `serviceConfig` field structure is **determined by the `ProviderService.serviceConfigSchema`**. Each service type has its own specific configuration structure. The frontend should use the `serviceConfigSchema` from the `ProviderService` to render appropriate form fields.

Below are examples for different service types:

### 1. Daily Challenge Service Config

**Service Type**: `DAILY_CHALLENGE`

**Note**: Daily Challenge services do NOT require filter-related fields (difficulties, topics, etc.) since they fetch a single daily problem.

```json
{
	"autoFetch": true,              // Automatically fetch daily problem
	"preferredTime": "09:00",       // Preferred time to fetch (HH:mm format)
	"timezone": "UTC",              // Timezone (e.g., "UTC", "America/New_York")
	"skipWeekends": false,          // Skip problems on weekends
	"skipPremium": true,             // Skip premium problems
	"fetchOnStartup": false         // Fetch immediately when service is enabled
}
```

**TypeScript Interface**:
```typescript
interface DailyChallengeServiceConfig {
	autoFetch?: boolean;
	preferredTime?: string;  // HH:mm format
	timezone?: string;
	skipWeekends?: boolean;
	skipPremium?: boolean;
	fetchOnStartup?: boolean;
}
```

### 2. Filter Challenge Service Config

**Service Type**: `FILTER_CHALLENGE`

**Note**: Filter Challenge services require filter-related fields to specify which problems to fetch.

```json
{
	"numberOfQuestions": 5,          // Number of problems to fetch
	"difficulties": ["EASY", "MEDIUM", "HARD"],  // Array of difficulty levels
	"topics": [                      // Array of topic tags
		"ARRAY",
		"STRING",
		"DYNAMIC_PROGRAMMING",
		"TWO_POINTERS",
		"BINARY_SEARCH"
	],
	"questionTypes": [               // Types of questions to include
		"PROBLEM_OF_THE_DAY",
		"PRACTICE_PROBLEM",
		"CONTEST_PROBLEM"
	],
	"scheduleTime": "08:00",        // Time to fetch problems (HH:mm format)
	"autoFetch": true,               // Automatically fetch on schedule
	"timezone": "UTC",               // Timezone
	"excludeSolved": true,           // Exclude problems user already solved
	"minRating": 1200,               // Minimum problem rating (if applicable)
	"maxRating": 2000,               // Maximum problem rating (if applicable)
	"tags": ["math", "greedy"],      // Additional tags to filter by
	"sortBy": "DIFFICULTY",          // Sort order: DIFFICULTY, RATING, ACCEPTANCE_RATE
	"sortOrder": "ASC"                // ASC or DESC
}
```

**TypeScript Interface**:
```typescript
interface FilterChallengeServiceConfig {
	numberOfQuestions?: number;
	difficulties?: string[];  // ["EASY", "MEDIUM", "HARD"]
	topics?: string[];        // Topic tags
	questionTypes?: string[]; // ["PROBLEM_OF_THE_DAY", "PRACTICE_PROBLEM"]
	scheduleTime?: string;    // HH:mm format
	autoFetch?: boolean;
	timezone?: string;
	excludeSolved?: boolean;
	minRating?: number;
	maxRating?: number;
	tags?: string[];
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
}
```

### 3. Weekly Challenge Service Config

**Service Type**: `WEEKLY_CHALLENGE`

```json
{
	"autoFetch": true,               // Automatically fetch weekly challenges
	"preferredDay": "MONDAY",         // Day of week to fetch (MONDAY-SUNDAY)
	"preferredTime": "09:00",        // Time to fetch (HH:mm format)
	"timezone": "UTC",               // Timezone
	"includePastChallenges": false,  // Include past weekly challenges
	"notifyBeforeStart": true,       // Notify before challenge starts
	"notifyBeforeStartHours": 24      // Hours before challenge to notify
}
```

**TypeScript Interface**:
```typescript
interface WeeklyChallengeServiceConfig {
	autoFetch?: boolean;
	preferredDay?: string;   // MONDAY-SUNDAY
	preferredTime?: string;   // HH:mm format
	timezone?: string;
	includePastChallenges?: boolean;
	notifyBeforeStart?: boolean;
	notifyBeforeStartHours?: number;
}
```

### 4. Contest Reminders Service Config

**Service Type**: `CONTEST_REMINDERS`

```json
{
	"reminderTimes": [               // Array of times to send reminders (HH:mm format)
		"24:00",                     // 24 hours before
		"12:00",                     // 12 hours before
		"01:00"                      // 1 hour before
	],
	"timezone": "UTC",               // Timezone
	"includeUpcoming": true,         // Include upcoming contests
	"includeOngoing": false,         // Include ongoing contests
	"minContestDuration": 60,         // Minimum contest duration in minutes
	"maxContestDuration": 180,       // Maximum contest duration in minutes
	"filterByProvider": true,        // Filter contests by provider
	"providerTypes": ["LEETCODE"]    // Array of provider types to include
}
```

**TypeScript Interface**:
```typescript
interface ContestRemindersServiceConfig {
	reminderTimes?: string[];  // Array of HH:mm format times
	timezone?: string;
	includeUpcoming?: boolean;
	includeOngoing?: boolean;
	minContestDuration?: number;  // minutes
	maxContestDuration?: number;  // minutes
	filterByProvider?: boolean;
	providerTypes?: string[];     // ["LEETCODE", "GFG"]
}
```

### Important Notes:

1. **Service Config Structure is Defined in ProviderService**: The `serviceConfigSchema` field in `ProviderService` defines what fields are available for each service type.

2. **Service-Specific Configs**: Each service type has its own specific configuration structure:
   - **Daily Challenge**: Simple config (no filter fields)
   - **Filter Challenge**: Includes filter fields (difficulties, topics, etc.)
   - **Weekly Challenge**: Day and time-based config
   - **Contest Reminders**: Reminder timing config

3. **Frontend Implementation**: The frontend should:
   - Fetch the `ProviderService` to get `serviceConfigSchema`
   - Use the schema to render appropriate form fields
   - Validate user input against the schema
   - Store the config in `UserProviderService.serviceConfig`

4. **Common Fields**: Some fields like `timezone`, `autoFetch`, and `scheduleTime`/`preferredTime` are common across many service types, but their usage depends on the service's `serviceConfigSchema`.

**How It Works**:

1. User navigates to a provider dashboard → Sees service cards (from ProviderService for that provider)
2. User clicks a service → Navigates to service page (e.g., `/dashboard/providers/leetcode/services/ps_001`)
3. On service page, user can:
    - Enable/disable the service (updates `UserProviderService.isEnabled`)
    - Configure service settings (updates `UserProviderService.serviceConfig`)
    - Configure notifications (creates/updates `NotificationConfig` linked to `UserProviderService`)
4. System creates/updates `UserProviderService` record and associated `NotificationConfig` for that user and ProviderService

### Scheduling Model (UserProviderService + ScheduledTask)

- **One `UserProviderService` corresponds to at most one `ScheduledTask`** in practice.  
  - Example: `user1 + LeetCode Daily Challenge` → one `ScheduledTask` row that says “run DAILY at 09:00 in Asia/Kolkata”.
  - If no `ScheduledTask` exists for a `UserProviderService`, that service is configured but **not scheduled** yet.
- **`ScheduledTask` points back to `UserProviderService`** via `userProviderServiceId`, so the scheduler can always resolve:
  - Which provider (`providerService.providerType`)
  - Which service type (`providerService.serviceType`, e.g. `DAILY_CHALLENGE`, `FILTER_CHALLENGE`)
  - Which service settings (`UserProviderService.serviceConfig`)
  - Which notification rules (`NotificationConfig`)
- **Daily vs Weekly vs Custom** is determined by `ScheduledTask.scheduleType`:
  - `DAILY`: run once per day, `nextRunAt` is recomputed using timezone + preferred time from `serviceConfig`.
  - `WEEKLY`: run once per week, `nextRunAt` uses preferred **day + time**.
  - `CUSTOM`: use `cronExpression` or any custom scheduling logic.
- The scheduler flow is:
  - Fetch `ScheduledTask` rows where `status = ACTIVE` and `nextRunAt <= now()`.
  - For each task, load `userProviderService` (+ `providerService`, `notificationConfig`, `user`) and execute the correct pipeline.
  - After running, update `lastRunAt` and compute the next `nextRunAt` for that same `ScheduledTask`.

---

## Complete Example: User Setup Flow

### Example 1: User Sets Up LeetCode Daily Challenge

**Step 1: System defines ProviderService**

```json
{
	"id": "ps_001",
	"name": "Daily Challenge",
	"description": "Get your daily LeetCode problem with AI-generated solutions and explanations",
	"imageUrl": "/images/services/daily-challenge.svg",
	"providerType": "LEETCODE",
	"serviceType": "DAILY_CHALLENGE",
	"serviceConfigSchema": {
		"type": "object",
		"properties": {
			"autoFetch": { "type": "boolean", "default": true },
			"preferredTime": { "type": "string", "format": "time", "default": "09:00" },
			"timezone": { "type": "string", "default": "UTC" },
			"skipWeekends": { "type": "boolean", "default": false },
			"skipPremium": { "type": "boolean", "default": true },
			"fetchOnStartup": { "type": "boolean", "default": false }
		}
	},
	"order": 1,
	"isActive": true,
	"isComingSoon": false,
	"createdAt": "2025-01-15T10:00:00Z",
	"updatedAt": "2025-01-15T10:00:00Z"
}
```

**Step 2: User Creates UserProviderService and NotificationConfig**

```json
// UserProviderService
{
	"id": "ups_001",
	"userId": "user_123",
	"providerServiceId": "ps_001",
	"isEnabled": true,
	"serviceConfig": {
		"autoFetch": true,
		"preferredTime": "09:00",
		"timezone": "UTC",
		"skipWeekends": false,
		"skipPremium": true,
		"fetchOnStartup": false
	},
	"createdAt": "2025-01-16T08:00:00Z",
	"updatedAt": "2025-01-16T08:00:00Z"
}

// NotificationConfig (linked to UserProviderService)
{
	"id": "nc_001",
	"userProviderServiceId": "ups_001",
	"enabled": true,
	"mailSubject": "Your Daily LeetCode Challenge: {problemTitle}",
	"emailFrequency": "DAILY",
	"preferredTime": "09:00",
	"includeBruteForce": false,
	"includeOptimized": true,
	"includeBestPractice": false,
	"includeAlternative": false,
	"includeExplanationOverview": true,
	"includeExplanationApproach": true,
	"includeStepByStep": false,
	"includeKeyInsights": false,
	"includeCommonMistakes": false,
	"includeRelatedProblems": false,
	"includeHintsProgressive": false,
	"includeHintsApproach": false,
	"includeHintsDataStructure": false,
	"includeHintsAlgorithm": false,
	"autoSubmit": true,
	"autoSubmitTime": "10:00",
	"autoSubmitOnlyIfSolved": true,
	"autoSubmitSendConfirmation": true,
	"autoSubmitConfirmationSubject": "✅ Solution Submitted: {problemTitle}",
	"preferredLanguage": "python",
	"createdAt": "2025-01-16T08:00:00Z",
	"updatedAt": "2025-01-16T08:00:00Z"
}
```

**Step 3: User Navigates to Service Page**

-   User goes to `/dashboard/providers/leetcode/services/ps_001`
-   Page shows:
    -   Service status toggle (isEnabled)
    -   Service settings (serviceConfig) - Fields are determined by `ProviderService.serviceConfigSchema`
    -   Notification settings (NotificationConfig)
-   User can update all settings on this page

**Step 4: System Resolves Config**
When system needs to send a Daily Challenge email:

1. Get ProviderService → Check if service exists and is active ✅
2. Get UserProviderService → Check if `isEnabled = true` ✅
3. Get NotificationConfig (via `userProviderService.notificationConfig`) → Check if `enabled = true` ✅
4. Use notification settings:
    - Subject: "Your Daily LeetCode Challenge: {problemTitle}"
    - Solutions: Optimized ✅ (includes code, explanation, complexity, stepByStep)
    - Explanations: Overview ✅, Approach ✅
    - Hints: None ❌
    - Auto-submit: Enabled ✅ (submit at 10:00)
    - Send at: 09:00 daily

---

### Example 2: User Sets Up Multiple Services

**UserProviderService Records with NotificationConfig**:

```json
// UserProviderService 1: Daily Challenge
{
	"id": "ups_001",
	"userId": "user_123",
	"providerServiceId": "ps_001", // LEETCODE + Daily Challenge
	"isEnabled": true,
	"serviceConfig": {
		"autoFetch": true,
		"preferredTime": "09:00"
	},
	"notificationConfig": {
		"id": "nc_001",
		"userProviderServiceId": "ups_001",
		"enabled": true,
		"mailSubject": "Your Daily LeetCode Challenge: {problemTitle}",
		"emailFrequency": "DAILY",
		"preferredTime": "09:00",
		"includeBruteForce": false,
		"includeOptimized": true,
		"includeBestPractice": false,
		"includeAlternative": false,
		"includeExplanationOverview": true,
		"includeExplanationApproach": true,
		"includeStepByStep": false,
		"includeKeyInsights": false,
		"includeCommonMistakes": false,
		"includeRelatedProblems": false,
		"includeHintsProgressive": false,
		"includeHintsApproach": false,
		"includeHintsDataStructure": false,
		"includeHintsAlgorithm": false,
		"autoSubmit": true,
		"autoSubmitTime": "10:00",
		"autoSubmitOnlyIfSolved": true,
		"autoSubmitSendConfirmation": true,
		"autoSubmitConfirmationSubject": "✅ Solution Submitted: {problemTitle}",
		"preferredLanguage": "python"
	}
}

// UserProviderService 2: Filter Challenge
{
	"id": "ups_002",
	"userId": "user_123",
	"providerServiceId": "ps_003", // LEETCODE + Filter Challenge
	"isEnabled": true,
	"serviceConfig": {
		"numberOfQuestions": 5,
		"difficulties": ["EASY", "MEDIUM"],
		"topics": ["ARRAY", "STRING"],
		"scheduleTime": "08:00"
	},
	"notificationConfig": {
		"id": "nc_002",
		"userProviderServiceId": "ups_002",
		"enabled": true,
		"mailSubject": "Your Filtered Problems - {numberOfQuestions} Questions Ready!",
		"emailFrequency": "DAILY",
		"preferredTime": "08:00",
		"includeBruteForce": true,
		"includeOptimized": true,
		"includeBestPractice": true,
		"includeAlternative": true,
		"includeExplanationOverview": true,
		"includeExplanationApproach": true,
		"includeStepByStep": true,
		"includeKeyInsights": true,
		"includeCommonMistakes": true,
		"includeRelatedProblems": true,
		"includeHintsProgressive": true,
		"includeHintsApproach": true,
		"includeHintsDataStructure": true,
		"includeHintsAlgorithm": true,
		"autoSubmit": false,
		"autoSubmitTime": null,
		"autoSubmitOnlyIfSolved": true,
		"autoSubmitSendConfirmation": false,
		"autoSubmitConfirmationSubject": null,
		"preferredLanguage": "python"
	}
}
```

---

## Configuration Flow

```
1. Admin defines ProviderService
   └─> One record per service per provider
   └─> Contains UI metadata (name, description, imageUrl, etc.)
   └─> Admin can enable/disable services (isActive)

2. Frontend displays services
   └─> Fetch ProviderService where providerType = [provider] and isActive = true
   └─> Display service cards with name, description, imageUrl
   └─> User clicks service → Navigate to service page → Show configuration

3. User configures service on service page
   └─> Enable/disable service (updates UserProviderService.isEnabled)
   └─> Configure service settings (updates UserProviderService.serviceConfig)
   └─> Configure notifications (creates/updates NotificationConfig linked to UserProviderService)
   └─> System creates/updates UserProviderService and NotificationConfig records

4. System resolves config when needed
   └─> Get ProviderService (check if exists and is active)
   └─> Get UserProviderService (check if isEnabled = true)
   └─> Get NotificationConfig (via userProviderService.notificationConfig, check if enabled = true)
   └─> Use resolved config for sending emails/fetching problems
```

---

## Database Schema

### 1. ProviderService Model

```prisma
// prisma/providerService.prisma
model ProviderService {
  id                String       @id @default(cuid())
  name              String       // Display name: "Daily Challenge"
  description       String       // Description: "Get daily coding problems"
  imageUrl          String?      // Image URL: "/images/daily-challenge.svg"
  providerType      ProviderType // LEETCODE, GFG, etc.
  serviceType       String       // Service type identifier: "DAILY_CHALLENGE", "FILTER_CHALLENGE", "WEEKLY_CHALLENGE", "CONTEST_REMINDERS"
  serviceConfigSchema Json?      // JSON schema defining the structure of serviceConfig for this service
  order             Int          @default(0)  // Display order
  isActive          Boolean      @default(true)  // Admin can enable/disable
  isComingSoon      Boolean     @default(false)  // Whether service is coming soon
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  // Relations
  userProviderServices UserProviderService[]

  @@unique([name, providerType])
  @@index([providerType])
  @@index([isActive])
  @@index([serviceType])
}
```

### 2. UserProviderService Model

```prisma
// prisma/userProviderService.prisma
model UserProviderService {
  id                String            @id @default(cuid())
  userId            String
  providerServiceId String            // Reference to ProviderService
  isEnabled         Boolean           @default(false)  // User enables/disables this service
  serviceConfig     Json?             // Service-specific settings (optional)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerService   ProviderService   @relation(fields: [providerServiceId], references: [id], onDelete: Cascade)
  notificationConfig NotificationConfig?  // One-to-one relation with NotificationConfig

  @@unique([userId, providerServiceId])
  @@index([userId])
  @@index([providerServiceId])
  @@index([isEnabled])
}
```

### 3. NotificationConfig Model (Updated - Aligned with Problem Model Structure)

```prisma
// prisma/notificationConfig.prisma
model NotificationConfig {
  id                 String   @id @default(cuid())
  userProviderServiceId String   @unique  // Reference to UserProviderService (instead of ProviderConfig)
  enabled            Boolean  @default(false)  // Whether notifications are enabled
  
  // Email Configuration
  mailSubject        String?  // Email subject line (supports variables like {problemTitle}, {numberOfQuestions}, {contestName})
  emailFrequency     String   @default("DAILY")  // DAILY, WEEKLY, INSTANT
  preferredTime      String?  // Time in HH:mm format (e.g., "09:00") - null for INSTANT
  
  // Solutions Configuration (matches Problem.solutions structure)
  includeBruteForce  Boolean  @default(false)  // Include solutions.bruteForce
  includeOptimized   Boolean  @default(false)  // Include solutions.optimized
  includeBestPractice Boolean @default(false)  // Include solutions.bestPractice
  includeAlternative Boolean  @default(false)  // Include solutions.alternative[]
  
  // Explanations Configuration (matches Problem.explanations structure)
  includeExplanationOverview Boolean @default(false)  // Include explanations.overview
  includeExplanationApproach Boolean @default(false)  // Include explanations.approach
  includeStepByStep  Boolean  @default(false)  // Include explanations.stepByStep[]
  includeKeyInsights Boolean  @default(false)  // Include explanations.keyInsights[]
  includeCommonMistakes Boolean @default(false)  // Include explanations.commonMistakes[]
  includeRelatedProblems Boolean @default(false)  // Include explanations.relatedProblems[]
  
  // Hints Configuration (matches Problem.hints structure)
  includeHintsProgressive Boolean @default(false)  // Include hints.progressive[]
  includeHintsApproach Boolean @default(false)  // Include hints.approach
  includeHintsDataStructure Boolean @default(false)  // Include hints.dataStructure
  includeHintsAlgorithm Boolean @default(false)  // Include hints.algorithm
  
  // Auto-Submit Configuration
  autoSubmit         Boolean  @default(false)
  autoSubmitTime     String?  // Time in HH:mm format (e.g., "10:00") - Required when autoSubmit is true
  autoSubmitOnlyIfSolved Boolean @default(true)  // Only submit if problem is solved
  autoSubmitSendConfirmation Boolean @default(true)  // Send confirmation email after submission
  autoSubmitConfirmationSubject String?  // Subject for confirmation email
  preferredLanguage  String   @default("python")  // Preferred programming language for auto-submit
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  userProviderService UserProviderService @relation(fields: [userProviderServiceId], references: [id], onDelete: Cascade)
}
```

**Verification: NotificationConfig Fields Match AI Output Structure**

This NotificationConfig structure is **exactly aligned** with the AI output format defined in `problem-format.prompt.ts` and stored in the `Problem` model JSON fields:

**✅ Solutions Mapping** (`Problem.solutions` JSON field):
- `solutions.bruteForce` → `includeBruteForce` ✅
- `solutions.optimized` → `includeOptimized` ✅
- `solutions.bestPractice` → `includeBestPractice` ✅ (from prompt line 76)
- `solutions.alternative[]` → `includeAlternative` ✅

**✅ Explanations Mapping** (`Problem.explanations` JSON field):
- `explanations.overview` → `includeExplanationOverview` ✅
- `explanations.approach` → `includeExplanationApproach` ✅
- `explanations.stepByStep[]` → `includeStepByStep` ✅
- `explanations.keyInsights[]` → `includeKeyInsights` ✅
- `explanations.commonMistakes[]` → `includeCommonMistakes` ✅
- `explanations.relatedProblems[]` → `includeRelatedProblems` ✅

**✅ Hints Mapping** (`Problem.hints` JSON field):
- `hints.progressive[]` → `includeHintsProgressive` ✅
- `hints.approach` → `includeHintsApproach` ✅
- `hints.dataStructure` → `includeHintsDataStructure` ✅
- `hints.algorithm` → `includeHintsAlgorithm` ✅

**Source References**:
- AI Prompt: `lib/ai-service/base/prompts/problem-format.prompt.ts` (lines 22-53)
- Problem Model: `prisma/problem.prisma` (lines 33-35)
- Problem Format Structure: `docs/problem-format-structure.md`

**Quick Reference Table**:

| Problem JSON Field | NotificationConfig Field | AI Output Structure | Status |
|-------------------|------------------------|-------------------|--------|
| `solutions.bruteForce` | `includeBruteForce` | `ProblemSolutions.bruteForce?: Solution` | ✅ Match |
| `solutions.optimized` | `includeOptimized` | `ProblemSolutions.optimized?: Solution` | ✅ Match |
| `solutions.bestPractice` | `includeBestPractice` | `ProblemSolutions.bestPractice?: Solution` | ✅ Match |
| `solutions.alternative[]` | `includeAlternative` | `ProblemSolutions.alternative?: Solution[]` | ✅ Match |
| `explanations.overview` | `includeExplanationOverview` | `ProblemExplanations.overview: string` | ✅ Match |
| `explanations.approach` | `includeExplanationApproach` | `ProblemExplanations.approach: string` | ✅ Match |
| `explanations.stepByStep[]` | `includeStepByStep` | `ProblemExplanations.stepByStep: ExplanationStep[]` | ✅ Match |
| `explanations.keyInsights[]` | `includeKeyInsights` | `ProblemExplanations.keyInsights: string[]` | ✅ Match |
| `explanations.commonMistakes[]` | `includeCommonMistakes` | `ProblemExplanations.commonMistakes: string[]` | ✅ Match |
| `explanations.relatedProblems[]` | `includeRelatedProblems` | `ProblemExplanations.relatedProblems?: RelatedProblem[]` | ✅ Match |
| `hints.progressive[]` | `includeHintsProgressive` | `ProblemHints.progressive: string[]` | ✅ Match |
| `hints.approach` | `includeHintsApproach` | `ProblemHints.approach: string` | ✅ Match |
| `hints.dataStructure` | `includeHintsDataStructure` | `ProblemHints.dataStructure?: string` | ✅ Match |
| `hints.algorithm` | `includeHintsAlgorithm` | `ProblemHints.algorithm?: string` | ✅ Match |

### 4. User Model (Add relation)

```prisma
// prisma/user.prisma
model User {
  // ... existing fields ...

  userProviderServices UserProviderService[]

  // ... rest of model ...
}
```

---

## Service Layer

### Config Service (`lib/config-service/config.service.ts`)

```typescript
interface AutoSubmitConfig {
	enabled: boolean;
	submitTime: string | null;
	preferredLanguage: string;
	submitOnlyIfSolved: boolean;
	sendConfirmationEmail: boolean;
	confirmationMailSubject: string;
}

// NotificationConfig matches the Prisma model
interface ResolvedServiceConfig {
	providerService: ProviderService;
	userProviderService: UserProviderService | null;
	notificationConfig: NotificationConfig | null;
	isEnabled: boolean;
	serviceConfig: Record<string, any> | null;
}

class ConfigService {
	// Get all services for a provider (for frontend display)
	async getServicesForProvider(
		providerType: ProviderType
	): Promise<ProviderService[]>;

	// Get user's config for a specific service
	async getUserProviderService(
		userId: string,
		providerServiceId: string
	): Promise<UserProviderService | null>;

	// Get resolved config (ProviderService + UserProviderService)
	async getResolvedServiceConfig(
		userId: string,
		providerServiceId: string
	): Promise<ResolvedServiceConfig>;

  // Create or update user provider service config
  async upsertUserProviderService(
    userId: string,
    providerServiceId: string,
    data: {
      isEnabled?: boolean;
      serviceConfig?: Record<string, any>;
      notificationConfig?: Partial<NotificationConfig>;
    }
  ): Promise<UserProviderService>;

  // Get notification config for a specific service
  async getServiceNotificationConfig(
    userId: string,
    providerServiceId: string
  ): Promise<NotificationConfig | null>;

	// Admin: Create or update service definition
	async upsertProviderService(
		name: string,
		providerType: ProviderType,
		data: Partial<ProviderService>
	): Promise<ProviderService>;
}
```

---

## API Endpoints

### User Endpoints

```
GET  /api/services/:provider                          - Get all services for provider
GET  /api/services/:providerServiceId                 - Get specific service definition
GET  /api/config/services/:providerServiceId          - Get user's config for a service
PUT  /api/config/services/:providerServiceId          - Update user's config for a service
GET  /api/config/services/:providerServiceId/resolved - Get resolved config (service + user config)
PUT  /api/config/services/:providerServiceId/enable   - Enable/disable service
PUT  /api/config/services/:providerServiceId/notifications - Update notification config
PUT  /api/config/services/:providerServiceId/settings - Update service settings
```

### Admin Endpoints

```
GET    /api/admin/services                            - Get all service definitions
GET    /api/admin/services/:provider                  - Get services for provider
POST   /api/admin/services                            - Create service definition
PUT    /api/admin/services/:id                         - Update service definition
DELETE /api/admin/services/:id                         - Delete service definition
```

---

## Frontend Implementation

### Provider Dashboard Page (Service Selection)

```
/dashboard/providers/[provider]

├── Service Cards Grid (from ProviderService)
│   ├── [Daily Challenge Card]
│   │   ├── Image: /images/services/daily-challenge.svg
│   │   ├── Name: "Daily Challenge"
│   │   ├── Description: "Get your daily coding problem..."
│   │   └── [Click] → Navigate to /dashboard/providers/[provider]/services/[serviceId]
│   │
│   ├── [Filter Challenge Card]
│   │   └── ...
│   │
│   └── [Weekly Challenge Card]
│       └── ...
│
└── Service Configuration Pages
    ├── /dashboard/providers/[provider]/services/[serviceId]
    │   ├── Service Status Toggle (isEnabled)
    │   ├── Service Settings Section (serviceConfig)
    │   │   ├── Auto-fetch: ☑
    │   │   └── Preferred time: [09:00]
     │   └── Notification Settings Section (NotificationConfig)
     │       ├── Enabled: ☑
     │       ├── Mail Subject: [Your Daily Challenge: {problemTitle}]
     │       ├── Email Frequency: [Daily ▼]
     │       ├── Preferred Time: [09:00]
     │       ├── Solutions:
     │       │   ├── ☐ Include Brute Force
     │       │   ├── ☑ Include Optimized
     │       │   ├── ☐ Include Best Practice
     │       │   └── ☐ Include Alternative Solutions
     │       ├── Explanations:
     │       │   ├── ☑ Include Overview
     │       │   ├── ☑ Include Approach
     │       │   ├── ☐ Include Step-by-Step
     │       │   ├── ☐ Include Key Insights
     │       │   ├── ☐ Include Common Mistakes
     │       │   └── ☐ Include Related Problems
     │       ├── Hints:
     │       │   ├── ☐ Include Progressive Hints
     │       │   ├── ☐ Include Approach Hint
     │       │   ├── ☐ Include Data Structure Hint
     │       │   └── ☐ Include Algorithm Hint
     │       └── Auto Submit:
     │           ├── ☑ Enable Auto Submit
     │           ├── Submit Time: [10:00]
     │           ├── Preferred Language: [Python ▼]
     │           ├── ☑ Submit Only If Solved
     │           ├── ☑ Send Confirmation Email
     │           └── Confirmation Subject: [✅ Solution Submitted: {problemTitle}]
    │
    └── /dashboard/providers/[provider]/services/[serviceId]
        └── [Similar structure for other services]
```

**Frontend Component Example**:

```typescript
// components/pages/providers/[provider]/service-grid.tsx
export function ServiceGrid({ provider }: { provider: ProviderType }) {
	const { data: services } = useQuery({
		queryKey: ["services", provider],
		queryFn: () => fetch(`/api/services/${provider}`).then((r) => r.json()),
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{services?.map((service) => (
				<ServiceCard
					key={service.id}
					name={service.name}
					description={service.description}
					imageUrl={service.imageUrl}
					onClick={() =>
						router.push(
							`/dashboard/providers/${provider}/services/${service.id}`
						)
					}
				/>
			))}
		</div>
	);
}
```

**Service Page Component Example**:

```typescript
// components/pages/providers/[provider]/services/[serviceId]/page.tsx
export function ServicePage({ serviceId }: { serviceId: string }) {
	const { data: resolvedConfig } = useQuery({
		queryKey: ["serviceConfig", serviceId],
		queryFn: () =>
			fetch(`/api/config/services/${serviceId}/resolved`).then((r) =>
				r.json()
			),
	});

	const isEnabled = resolvedConfig?.userProviderService?.isEnabled || false;
	const serviceSettings = resolvedConfig?.userProviderService?.serviceConfig;
	const notifications = resolvedConfig?.notificationConfig;

	return (
		<div>
			<ServiceToggle
				enabled={isEnabled}
				onChange={(enabled) =>
					updateServiceConfig({ isEnabled: enabled })
				}
			/>
			<ServiceSettings
				config={serviceSettings}
				onChange={(config) =>
					updateServiceConfig({ serviceConfig: config })
				}
			/>
			<NotificationSettings
				config={notifications}
				onChange={(notificationConfig) =>
					updateNotificationConfig(notificationConfig)
				}
			/>
		</div>
	);
}
```

---

## Real-World Usage Example

### Scenario: System Sends Daily Challenge Email

**Step 1: System fetches problem**

-   Provider: LeetCode
-   Service: Daily Challenge (providerServiceId: "ps_001")
-   Problem: "Two Sum"

**Step 2: System resolves config**

```typescript
const resolvedConfig = await configService.getResolvedServiceConfig(
	userId,
	"ps_001"
);

// Check if service exists and is active
if (
	!resolvedConfig.providerService ||
	!resolvedConfig.providerService.isActive
) {
	return; // Service not available
}

// Check if user enabled it
if (!resolvedConfig.isEnabled) {
	return; // User disabled it
}

// Get notification config
const notification = resolvedConfig.notificationConfig;
if (!notification || !notification.enabled) {
	return; // Notifications disabled
}
```

**Step 3: System builds email**

```typescript
const emailSubject = notification.mailSubject.replace(
	"{problemTitle}",
	"Two Sum"
);
// Result: "Your Daily LeetCode Challenge: Two Sum"

// Build email content based on NotificationConfig flags
const emailContent: any = {};

// Solutions (from Problem.solutions)
if (notification.includeOptimized && problem.solutions?.optimized) {
	emailContent.optimizedSolution = {
		code: problem.solutions.optimized.code,
		explanation: problem.solutions.optimized.explanation,
		complexity: problem.solutions.optimized.complexity,
		stepByStep: problem.solutions.optimized.stepByStep
	};
}
if (notification.includeBruteForce && problem.solutions?.bruteForce) {
	emailContent.bruteForceSolution = problem.solutions.bruteForce;
}
if (notification.includeBestPractice && problem.solutions?.bestPractice) {
	emailContent.bestPracticeSolution = problem.solutions.bestPractice;
}
if (notification.includeAlternative && problem.solutions?.alternative) {
	emailContent.alternativeSolutions = problem.solutions.alternative;
}

// Explanations (from Problem.explanations)
if (problem.explanations) {
	if (notification.includeExplanationOverview) {
		emailContent.overview = problem.explanations.overview;
	}
	if (notification.includeExplanationApproach) {
		emailContent.approach = problem.explanations.approach;
	}
	if (notification.includeStepByStep) {
		emailContent.stepByStep = problem.explanations.stepByStep;
	}
	if (notification.includeKeyInsights) {
		emailContent.keyInsights = problem.explanations.keyInsights;
	}
	if (notification.includeCommonMistakes) {
		emailContent.commonMistakes = problem.explanations.commonMistakes;
	}
	if (notification.includeRelatedProblems) {
		emailContent.relatedProblems = problem.explanations.relatedProblems;
	}
}

// Hints (from Problem.hints)
if (problem.hints) {
	if (notification.includeHintsProgressive) {
		emailContent.progressiveHints = problem.hints.progressive;
	}
	if (notification.includeHintsApproach) {
		emailContent.approachHint = problem.hints.approach;
	}
	if (notification.includeHintsDataStructure) {
		emailContent.dataStructureHint = problem.hints.dataStructure;
	}
	if (notification.includeHintsAlgorithm) {
		emailContent.algorithmHint = problem.hints.algorithm;
	}
}
```

**Step 4: System schedules email**

```typescript
if (notification.emailFrequency === "DAILY") {
	scheduleEmail(emailSubject, emailContent, notification.preferredTime);
} else if (notification.emailFrequency === "INSTANT") {
	sendEmailImmediately(emailSubject, emailContent);
}
```

**Step 5: System handles auto-submit (if enabled)**

```typescript
if (notification.autoSubmit) {
	// Get the solution code to submit (prefer optimized, fallback to bestPractice)
	const solutionCode = 
		(notification.includeOptimized && problem.solutions?.optimized?.code) ||
		(notification.includeBestPractice && problem.solutions?.bestPractice?.code) ||
		(notification.includeBruteForce && problem.solutions?.bruteForce?.code) ||
		null;

	if (solutionCode) {
		scheduleAutoSubmit({
			problemId: problem.id,
			submitTime: notification.autoSubmitTime,
			preferredLanguage: notification.preferredLanguage,
			code: solutionCode,
			submitOnlyIfSolved: notification.autoSubmitOnlyIfSolved,
			sendConfirmationEmail: notification.autoSubmitSendConfirmation,
			confirmationSubject: notification.autoSubmitConfirmationSubject?.replace(
				"{problemTitle}",
				problem.title
			) || `✅ Solution Submitted: ${problem.title}`,
		});
	}
}
```

---

## Benefits

-   **Simplified**: Only 2 models (ProviderService, UserProviderService)
-   **Provider-Specific**: Each service is tied to a specific provider
-   **Flexible**: Per-service notification settings with custom mail subjects
-   **Scalable**: Easy to add new services or providers
-   **Professional**: Clean separation of concerns (service definitions vs user config)
-   **Frontend-Friendly**: Service definitions include all UI metadata needed for display
-   **Admin-Controlled**: Admin can enable/disable services without code changes

---

## Summary

**Core Models**:

1. `ProviderService` - Service definitions per provider with UI metadata (name, description, imageUrl, providerType)
2. `UserProviderService` - User's service configuration with notification preferences (per user, per ProviderService)

**Key Features**:

-   **Service Definitions**: ProviderService model stores UI metadata (name, description, imageUrl) per provider
-   **Frontend Display**: Users can see and click service cards to configure services
-   **Service Configuration**: When user navigates to a service page, they can configure:
    -   Service enablement (isEnabled)
    -   Service settings (serviceConfig)
    -   Notification settings (notificationJson)
    -   Auto-submit configuration (within notificationJson.autoSubmit)
-   **Unified Config**: All configuration stored in UserProviderService per user, per ProviderService
-   **Per-Service Notifications**: Each service can have different email content flags and subjects
-   **Auto-Submit**: Auto-submit is a notification feature that can be enabled within any service's notification settings
-   **Dynamic Subjects**: Supports variables in mail subjects ({problemTitle}, {numberOfQuestions}, etc.)
-   **Admin Control**: Admin can enable/disable services via isActive field
