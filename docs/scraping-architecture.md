# Scraping Architecture & Provider Service Guide

## Overview

This document defines the generic scraping architecture that works across all providers (LeetCode, GFG, and future providers). The architecture uses an abstract base class pattern to ensure consistency while allowing provider-specific implementations.

## Architecture Pattern

### Design Principles

1. **Abstract Base Class**: Defines common interface and shared functionality
2. **Provider-Specific Classes**: Implement provider-specific logic
3. **Factory Pattern**: Creates appropriate provider instance based on type
4. **Reusability**: Common functions (browser management, error handling) shared across providers

---

## Base Provider Service (Abstract Class)

**Location:** `lib/provider-service/base-provider.service.ts`

### Abstract Interface

```typescript
export interface IProviderService {
  // Authentication
  login(credentials: Credentials): Promise<boolean>;
  
  // Daily Problem
  scrapeDailyQuestion(): Promise<Problem>;
}
```

### Abstract Base Class

```typescript
import puppeteer, { Browser, Page } from 'puppeteer';
import { IProviderService } from './provider.interface';

export abstract class BaseProviderService implements IProviderService {
  protected browser: Browser | null = null;
  protected page: Page | null = null;
  protected isLoggedIn: boolean = false;
  
  constructor(protected providerType: ProviderType) {}

  // ========== Common Browser Management ==========
  
  /**
   * Initialize browser instance (shared across all providers)
   */
  protected async initBrowser(): Promise<void> {
    if (this.browser) {
      return; // Already initialized
    }
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }

  /**
   * Create new page (shared across all providers)
   */
  protected async createPage(): Promise<Page> {
    await this.initBrowser();
    this.page = await this.browser!.newPage();
    
    // Common page settings
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    return this.page;
  }

  /**
   * Close browser and cleanup (shared across all providers)
   */
  protected async closeBrowser(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.isLoggedIn = false;
  }

  /**
   * Wait for element with retry (shared utility)
   */
  protected async waitForElement(
    selector: string,
    timeout: number = 30000,
    retries: number = 3
  ): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.page!.waitForSelector(selector, { timeout });
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page!.waitForTimeout(2000); // Wait 2s before retry
      }
    }
  }

  /**
   * Extract text from element (shared utility)
   */
  protected async extractText(selector: string): Promise<string> {
    return await this.page!.$eval(selector, el => el.textContent?.trim() || '');
  }

  /**
   * Extract multiple elements (shared utility)
   */
  protected async extractElements<T>(
    selector: string,
    extractor: (element: Element) => T
  ): Promise<T[]> {
    return await this.page!.$$eval(selector, (elements, extractFn) => {
      return elements.map(el => extractFn(el));
    }, extractor);
  }

  // ========== Abstract Methods (Must be implemented by each provider) ==========
  
  abstract login(credentials: Credentials): Promise<boolean>;
  abstract scrapeDailyQuestion(): Promise<Problem>;
}
```

---

## Provider-Specific Implementations

### LeetCode Service

**Location:** `lib/provider-service/leetcode.service.ts`

```typescript
import { BaseProviderService } from './base-provider.service';
import { ProviderType } from '@prisma/client';

export class LeetCodeService extends BaseProviderService {
  private readonly BASE_URL = 'https://leetcode.com';
  
  constructor() {
    super(ProviderType.LEETCODE);
  }

  async login(credentials: Credentials): Promise<boolean> {
    try {
      await this.createPage();
      
      // Navigate to login page
      await this.page!.goto(`${this.BASE_URL}/accounts/login/`, {
        waitUntil: 'networkidle2'
      });
      
      // Fill login form (LeetCode-specific selectors)
      await this.page!.type('#id_login', credentials.email);
      await this.page!.type('#id_password', credentials.password);
      await this.page!.click('button[type="submit"]');
      
      // Wait for navigation/validation
      await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check if logged in (LeetCode-specific check)
      const isLoggedIn = await this.page!.$('a[href="/accounts/logout/"]') !== null;
      this.isLoggedIn = isLoggedIn;
      
      return isLoggedIn;
    } catch (error) {
      await this.closeBrowser();
      throw new Error(`LeetCode login failed: ${error.message}`);
    }
  }

  async scrapeDailyQuestion(): Promise<Problem> {
    try {
      await this.createPage();
      
      // Navigate to daily challenge (LeetCode-specific URL)
      await this.page!.goto(`${this.BASE_URL}/problemset/`, {
        waitUntil: 'networkidle2'
      });
      
      // Find daily challenge link (LeetCode-specific selector)
      // Note: Actual selector may vary, adjust based on LeetCode's HTML structure
      const dailyLink = await this.page!.$('a[href*="/problems/"]');
      if (!dailyLink) {
        throw new Error('Daily problem not found');
      }
      
      // Extract problem data (LeetCode-specific structure)
      const problemId = await this.extractText('[data-cy="question-title"]');
      const title = await this.extractText('h3');
      const difficulty = await this.extractText('.difficulty-label');
      
      // Navigate to problem page
      await dailyLink.click();
      await this.page!.waitForNavigation();
      
      // Extract full problem details
      const description = await this.extractText('.question-content');
      const topics = await this.extractElements('a[href*="/tag/"]', el => el.textContent?.trim() || '');
      const problemUrl = this.page!.url();
      
      return {
        id: this.extractIdFromUrl(problemUrl),
        slug: this.extractSlugFromUrl(problemUrl),
        url: problemUrl,
        title,
        difficulty,
        topics,
        description,
        provider: ProviderType.LEETCODE
      };
    } catch (error) {
      await this.closeBrowser();
      throw new Error(`Failed to scrape LeetCode daily problem: ${error.message}`);
    }
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/problems\/([^\/]+)/);
    return match ? match[1] : '';
  }

  private extractSlugFromUrl(url: string): string {
    const match = url.match(/\/problems\/([^\/]+)/);
    return match ? match[1] : '';
  }
}
```

---

### GFG Service

**Location:** `lib/provider-service/gfg.service.ts`

```typescript
import { BaseProviderService } from './base-provider.service';
import { ProviderType } from '@prisma/client';

export class GFGService extends BaseProviderService {
  private readonly BASE_URL = 'https://www.geeksforgeeks.org';
  
  constructor() {
    super(ProviderType.GFG);
  }

  async login(credentials: Credentials): Promise<boolean> {
    try {
      await this.createPage();
      
      // Navigate to login page (GFG-specific URL)
      await this.page!.goto(`${this.BASE_URL}/user/login/`, {
        waitUntil: 'networkidle2'
      });
      
      // Fill login form (GFG-specific selectors)
      await this.page!.type('input[name="email"]', credentials.email);
      await this.page!.type('input[name="password"]', credentials.password);
      await this.page!.click('button[type="submit"]');
      
      // Wait for navigation
      await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check if logged in (GFG-specific check)
      const isLoggedIn = await this.page!.$('a[href*="/user/logout"]') !== null;
      this.isLoggedIn = isLoggedIn;
      
      return isLoggedIn;
    } catch (error) {
      await this.closeBrowser();
      throw new Error(`GFG login failed: ${error.message}`);
    }
  }

  async scrapeDailyQuestion(): Promise<Problem> {
    try {
      await this.createPage();
      
      // Navigate to explore page (GFG-specific URL)
      await this.page!.goto(`${this.BASE_URL}/explore`, {
        waitUntil: 'networkidle2'
      });
      
      // Find daily problem (GFG-specific selector)
      // Note: Adjust selector based on actual GFG HTML structure
      const dailyProblem = await this.page!.$('.explore_daily_problem__ABC123');
      if (!dailyProblem) {
        throw new Error('Daily problem not found');
      }
      
      // Extract problem data (GFG-specific structure)
      const title = await this.extractText('.explore_problem_title__XYZ789');
      const difficulty = await this.extractText('.explore_difficulty__DEF456');
      const problemUrl = await this.page!.evaluate(el => el.getAttribute('href'), dailyProblem);
      
      // Navigate to problem page
      await this.page!.goto(problemUrl!, { waitUntil: 'networkidle2' });
      
      // Extract full details
      const description = await this.extractText('.problem-content');
      const topics = await this.extractElements('.problem-tags span', el => el.textContent?.trim() || '');
      
      return {
        id: this.extractIdFromUrl(problemUrl!),
        slug: this.extractSlugFromUrl(problemUrl!),
        url: problemUrl!,
        title,
        difficulty,
        topics,
        description,
        provider: ProviderType.GFG
      };
    } catch (error) {
      await this.closeBrowser();
      throw new Error(`Failed to scrape GFG daily problem: ${error.message}`);
    }
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+)\//);
    return match ? match[1] : '';
  }

  private extractSlugFromUrl(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }
}
```

---

## Provider Factory

**Location:** `lib/provider-service/provider-factory.ts`

```typescript
import { IProviderService } from './provider.interface';
import { LeetCodeService } from './leetcode.service';
import { GFGService } from './gfg.service';
import { ProviderType } from '@prisma/client';

export class ProviderFactory {
  /**
   * Create provider service instance based on provider type
   */
  static create(providerType: ProviderType): IProviderService {
    switch (providerType) {
      case ProviderType.LEETCODE:
        return new LeetCodeService();
      
      case ProviderType.GFG:
        return new GFGService();
      
      default:
        throw new Error(`Unsupported provider: ${providerType}`);
    }
  }

  /**
   * Get all supported providers
   */
  static getSupportedProviders(): ProviderType[] {
    return [ProviderType.LEETCODE, ProviderType.GFG];
  }

  /**
   * Check if provider is supported
   */
  static isSupported(providerType: ProviderType): boolean {
    return this.getSupportedProviders().includes(providerType);
  }
}
```

---

## Type Definitions

**Location:** `interface/provider.interface.ts`

```typescript
export interface Credentials {
  email: string;
  password: string;
}

export interface Problem {
  id: string;
  slug: string;
  url: string;
  title: string;
  difficulty: string;
  topics: string[];
  description?: string;
  examples?: any[];
  constraints?: string;
  isPremium?: boolean;
  provider: ProviderType;
}
```

---

## Usage Examples

### Get Daily Problem (No Login Required)

```typescript
// Create provider service
const provider = ProviderFactory.create(ProviderType.LEETCODE);

// Scrape daily problem (public, no login needed)
const dailyProblem = await provider.scrapeDailyQuestion();

// Store in database
await prisma.dailyQuestion.create({
  data: {
    provider: ProviderType.LEETCODE,
    problemId: dailyProblem.id,
    problemSlug: dailyProblem.slug,
    problemUrl: dailyProblem.url,
    title: dailyProblem.title,
    difficulty: dailyProblem.difficulty,
    topics: dailyProblem.topics,
    description: dailyProblem.description,
    problemDate: new Date(),
    scrapedAt: new Date()
  }
});
```

### Login (For Future Use)

```typescript
// Get user credentials
const credentials = await CredentialService.getCredentials(providerConfigId);

// Create provider service
const provider = ProviderFactory.create(ProviderType.LEETCODE);

// Login
const loginSuccess = await provider.login(credentials);

if (loginSuccess) {
  console.log('Logged in successfully');
} else {
  console.error('Login failed');
}
```

---

## Adding New Provider

### Step 1: Create Provider Service Class

**Location:** `lib/provider-service/codeforces.service.ts`

```typescript
import { BaseProviderService } from './base-provider.service';
import { ProviderType } from '@prisma/client';

export class CodeforcesService extends BaseProviderService {
  private readonly BASE_URL = 'https://codeforces.com';
  
  constructor() {
    super(ProviderType.CODEFORCES);
  }

  async login(credentials: Credentials): Promise<boolean> {
    try {
      await this.createPage();
      
      // Navigate to login page
      await this.page!.goto(`${this.BASE_URL}/enter`, {
        waitUntil: 'networkidle2'
      });
      
      // Fill login form (Codeforces-specific selectors)
      await this.page!.type('input[name="handleOrEmail"]', credentials.email);
      await this.page!.type('input[name="password"]', credentials.password);
      await this.page!.click('input[type="submit"]');
      
      // Wait for navigation
      await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check if logged in
      const isLoggedIn = await this.page!.$('a[href*="/logout"]') !== null;
      this.isLoggedIn = isLoggedIn;
      
      return isLoggedIn;
    } catch (error) {
      await this.closeBrowser();
      throw new Error(`Codeforces login failed: ${error.message}`);
    }
  }

  async scrapeDailyQuestion(): Promise<Problem> {
    try {
      await this.createPage();
      
      // Navigate to problems page
      await this.page!.goto(`${this.BASE_URL}/problemset`, {
        waitUntil: 'networkidle2'
      });
      
      // Find daily/problem of the day (Codeforces-specific logic)
      // Implement Codeforces-specific scraping...
      
      return {
        id: 'problem-id',
        slug: 'problem-slug',
        url: 'problem-url',
        title: 'Problem Title',
        difficulty: 'Easy',
        topics: ['Array', 'String'],
        description: 'Problem description',
        provider: ProviderType.CODEFORCES
      };
    } catch (error) {
      await this.closeBrowser();
      throw new Error(`Failed to scrape Codeforces daily problem: ${error.message}`);
    }
  }
}
```

### Step 2: Update Provider Factory

```typescript
import { CodeforcesService } from './codeforces.service';

export class ProviderFactory {
  static create(providerType: ProviderType): IProviderService {
    switch (providerType) {
      case ProviderType.LEETCODE:
        return new LeetCodeService();
      case ProviderType.GFG:
        return new GFGService();
      case ProviderType.CODEFORCES:  // Add new case
        return new CodeforcesService();
      default:
        throw new Error(`Unsupported provider: ${providerType}`);
    }
  }
}
```

### Step 3: Update Prisma Schema

```prisma
enum ProviderType {
  LEETCODE
  GFG
  CODEFORCES  // Add new provider
}
```

---

## Common Patterns & Best Practices

### 1. Error Handling

Always wrap provider methods in try-catch and cleanup:

```typescript
async scrapeDailyQuestion(): Promise<Problem> {
  try {
    await this.createPage();
    // ... scraping logic
    return problem;
  } catch (error) {
    await this.closeBrowser();
    throw new Error(`Failed to scrape ${this.providerType}: ${error.message}`);
  }
}
```

### 2. Retry Logic

For unreliable operations, add retry:

```typescript
protected async retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      await this.page!.waitForTimeout(2000 * (i + 1)); // Exponential backoff
    }
  }
  throw new Error('Operation failed after retries');
}
```

### 3. Rate Limiting

Add delays between requests to avoid being blocked:

```typescript
protected async rateLimit(delay: number = 1000): Promise<void> {
  await this.page!.waitForTimeout(delay);
}
```

---

## Summary

- **Abstract Base Class**: Common browser management and utilities
- **Two Core Functions**: `login()` and `scrapeDailyQuestion()`
- **Provider Classes**: Implement provider-specific logic
- **Factory Pattern**: Easy provider creation
- **Reusable**: Shared functions reduce code duplication
- **Extensible**: Easy to add new providers

This architecture ensures consistency across providers while allowing flexibility for provider-specific implementations.
