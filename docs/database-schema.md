# Database Schema & Authentication Guide

## Overview

This document defines the core database schema for:
1. **Daily Questions** - Storage and tracking of daily problems
2. **User Records** - User management and authentication
3. **Provider Configuration** - Per-user, per-provider settings

Additionally, it covers **passwordless authentication** with **OTP-based login** and **JWT token management**.

## Core Database Schema

### User Model

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  emailVerified Boolean  @default(false)
  emailVerifiedAt DateTime?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  providerConfigs ProviderConfig[]
  scheduledTasks  ScheduledTask[]
  authTokens      AuthToken[]
  dailyQuestionLogs DailyQuestionLog[]
  
  @@index([email])
}
```

---

### AuthToken Model

```prisma
model AuthToken {
  id              String   @id @default(cuid())
  userId          String
  token           String   @unique // Hashed OTP or refreshToken
  tokenType       TokenType
  purpose         TokenPurpose
  expiresAt       DateTime
  usedAt          DateTime?
  isUsed          Boolean  @default(false)
  isRevoked       Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([token])
  @@index([userId, isUsed, expiresAt])
  @@index([expiresAt])
}

enum TokenType {
  OTP
  REFRESH_TOKEN
}

enum TokenPurpose {
  LOGIN
}
```

**Important:** This table stores:
- ✅ **OTP tokens** (hashed) - for login verification
- ✅ **RefreshToken** (hashed) - for session management
- ❌ **NOT AccessToken** - only stored in HTTP-only cookie

---

### ProviderConfig Model

```prisma
model ProviderConfig {
  id              String   @id @default(cuid())
  userId          String
  provider        ProviderType
  credentials     EncryptedCredentials?
  notificationConfig NotificationConfig?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  scheduledTasks  ScheduledTask[]
  dailyQuestionLogs DailyQuestionLog[]
  
  @@unique([userId, provider])
}

enum ProviderType {
  LEETCODE
  GFG
}
```

---

### EncryptedCredentials Model

```prisma
model EncryptedCredentials {
  id              String   @id @default(cuid())
  providerConfigId String  @unique
  encryptedEmail  String
  encryptedPassword String
  iv              String
  tag             String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  providerConfig ProviderConfig @relation(fields: [providerConfigId], references: [id], onDelete: Cascade)
}
```

---

### NotificationConfig Model

```prisma
model NotificationConfig {
  id              String   @id @default(cuid())
  providerConfigId String  @unique
  includeExplanation Boolean @default(false)
  includeBruteForce Boolean  @default(false)
  includeOptimized  Boolean  @default(false)
  includeHints      Boolean  @default(false)
  autoSubmit        Boolean  @default(false)
  emailTemplate   String?
  preferredLanguage String @default("en")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  providerConfig ProviderConfig @relation(fields: [providerConfigId], references: [id], onDelete: Cascade)
}
```

---

### DailyQuestion Model

```prisma
model DailyQuestion {
  id              String   @id @default(cuid())
  provider        ProviderType
  problemId       String
  problemSlug     String
  problemUrl      String
  title           String
  difficulty      String
  topics          String[]
  description     String?
  examples        Json?
  constraints     String?
  isPremium       Boolean  @default(false)
  scrapedAt       DateTime @default(now())
  problemDate     DateTime
  
  logs            DailyQuestionLog[]
  
  @@unique([provider, problemDate])
  @@index([provider, problemDate])
}
```

---

### DailyQuestionLog Model

```prisma
model DailyQuestionLog {
  id              String   @id @default(cuid())
  userId          String
  providerConfigId String
  dailyQuestionId String
  status          DeliveryStatus @default(PENDING)
  sentAt          DateTime?
  emailSent       Boolean  @default(false)
  codeSubmitted   Boolean  @default(false)
  submissionResult String?
  errorMessage    String?
  retryCount      Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerConfig  ProviderConfig  @relation(fields: [providerConfigId], references: [id], onDelete: Cascade)
  dailyQuestion   DailyQuestion   @relation(fields: [dailyQuestionId], references: [id], onDelete: Cascade)
  
  @@unique([userId, providerConfigId, dailyQuestionId])
}

enum DeliveryStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
  RETRYING
}
```

---

### ScheduledTask Model

```prisma
model ScheduledTask {
  id              String   @id @default(cuid())
  userId          String
  providerConfigId String
  scheduleType    ScheduleType
  cronExpression String?
  timezone        String   @default("UTC")
  status          TaskStatus @default(PENDING)
  lastRunAt       DateTime?
  nextRunAt       DateTime?
  problemSelection ProblemSelection?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerConfig  ProviderConfig  @relation(fields: [providerConfigId], references: [id], onDelete: Cascade)
  
  @@index([userId, status])
}

enum ScheduleType {
  DAILY
  WEEKLY
  CUSTOM
}

enum TaskStatus {
  PENDING
  ACTIVE
  PAUSED
  COMPLETED
  FAILED
}

enum ProblemSelection {
  RANDOM
  DAILY_CHALLENGE
  FILTER_BASED
  SPECIFIC_PROBLEM
}
```

---

## Authentication Flow

### Step 1: Request Login
- User enters email
- Create user if doesn't exist
- Generate 6-digit OTP
- Hash OTP and store in `AuthToken` table with `tokenType: 'OTP'`
- Send OTP to email

### Step 2: Verify OTP
- User enters OTP
- Find OTP token in `AuthToken` table
- Compare hashed OTP
- Mark OTP as used

### Step 3: Generate Tokens (Login)
- Generate `accessToken` (JWT, 10 min) - **NOT stored in database**
- Generate `refreshToken` (JWT, 12 min) - **Hash and store in `AuthToken` table**
- Set both as HTTP-only cookies
- Update user: `emailVerified: true`

### Step 4: Middleware (Token Refresh)
- Validate `accessToken` from cookie (JWT verification only, no database)
- If expired, validate `refreshToken` (JWT + database lookup)
- If `refreshToken` valid, generate new tokens and update cookies
- If both expired, return 401 error

### Step 5: Logout
- Clear cookies
- Revoke `refreshToken` in database (`isRevoked: true`)
- Return user data

---

## Why We Store RefreshToken But Not AccessToken

### AccessToken (NOT Stored in Database)

**Stored only in:** HTTP-only cookie

**Reasons:**
1. **Short-lived (10 minutes)**: Expires quickly, no need to track
2. **Stateless validation**: JWT signature verification only (no database query)
3. **Performance**: No database lookup on every request (faster)
4. **Scalability**: Works in distributed systems without shared database
5. **No revocation needed**: Expires before revocation becomes critical

**Validation:** Extract JWT → Verify signature → Check expiration (all from JWT payload)

---

### RefreshToken (STORED in Database)

**Stored in:** 
- HTTP-only cookie (plain JWT)
- `AuthToken` table (hashed)

**Reasons:**
1. **Revocation capability**: Can revoke token on logout/security breach
2. **Longer-lived (12 minutes)**: Needs tracking for security
3. **Database validation**: Must check if token exists and not revoked
4. **Security**: Can invalidate all user sessions if compromised

**Validation:** Extract JWT → Verify signature → Query database → Check hash match → Check revocation status

---

## API Response Interface

**Location:** `interface/api.interface.ts`

```typescript
export interface ApiResponse<T = any> {
  data: T;
  error: any;
  message: string;
  success: boolean;
  statusCode: number;
}
```

---

## Middleware Implementation

### 1. Auth Middleware

**Location:** `lib/middleware/auth.middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma-client';
import bcrypt from 'bcrypt';

interface JWTPayload {
  userId: string;
}

type RouteHandler = (
  request: NextRequest,
  userId: string,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

export function authMiddleware(handler: RouteHandler) {
  return async (
    request: NextRequest,
    context?: { params?: { [key: string]: string } }
  ) => {
    try {
      const accessToken = request.cookies.get('accessToken')?.value;
      const refreshToken = request.cookies.get('refreshToken')?.value;

      // Try accessToken first (no database lookup)
      if (accessToken) {
        try {
          const decoded = verify(accessToken, process.env.JWT_SECRET!) as JWTPayload;
          return await handler(request, decoded.userId, context?.params);
        } catch (error) {
          // AccessToken expired, check refreshToken
        }
      }

      // AccessToken expired/invalid, check refreshToken
      if (!refreshToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Verify refreshToken JWT
      let refreshPayload: JWTPayload;
      try {
        refreshPayload = verify(refreshToken, process.env.JWT_SECRET!) as JWTPayload;
      } catch (error) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }

      // Find refreshToken in database
      const tokens = await prisma.authToken.findMany({
        where: {
          userId: refreshPayload.userId,
          tokenType: 'REFRESH_TOKEN',
          isRevoked: false,
          expiresAt: { gt: new Date() }
        }
      });

      // Validate hash
      let tokenFound = false;
      let matchedToken = null;
      for (const token of tokens) {
        if (await bcrypt.compare(refreshToken, token.token)) {
          tokenFound = true;
          matchedToken = token;
          break;
        }
      }

      if (!tokenFound) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      // Generate new tokens
      const newAccessToken = sign({ userId: refreshPayload.userId }, process.env.JWT_SECRET!, { expiresIn: '10m' });
      const newRefreshToken = sign({ userId: refreshPayload.userId }, process.env.JWT_SECRET!, { expiresIn: '12m' });
      const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);

      // Revoke old, store new
      await prisma.authToken.update({ where: { id: matchedToken.id }, data: { isRevoked: true } });
      await prisma.authToken.create({
        data: {
          userId: refreshPayload.userId,
          token: hashedRefresh,
          tokenType: 'REFRESH_TOKEN',
          purpose: 'LOGIN',
          expiresAt: new Date(Date.now() + 12 * 60 * 1000)
        }
      });

      // Execute handler
      const response = await handler(request, refreshPayload.userId, context?.params);

      // Set new cookies
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 60,
        path: '/'
      });

      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 12 * 60,
        path: '/'
      });

      return response;
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
```

---

### 2. Response Format Middleware

**Location:** `lib/middleware/response-format.middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/interface/api.interface';

type RouteHandler = (
  request: NextRequest,
  userId?: string,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

export function responseFormatMiddleware(handler: RouteHandler) {
  return async (
    request: NextRequest,
    context?: { params?: { [key: string]: string } }
  ) => {
    try {
      // Execute handler
      const response = await handler(request, undefined, context?.params);
      
      // Clone response to read body
      const clonedResponse = response.clone();
      const responseData = await clonedResponse.json().catch(() => ({}));
      const statusCode = response.status;

      // Check if already formatted
      if (responseData.success !== undefined && responseData.statusCode !== undefined) {
        return response; // Already formatted
      }

      // Format response
      const formattedResponse: ApiResponse = {
        data: responseData.data !== undefined ? responseData.data : (responseData.error ? null : responseData),
        error: responseData.error || null,
        message: responseData.message || (statusCode >= 200 && statusCode < 300 ? 'Success' : 'Error'),
        success: statusCode >= 200 && statusCode < 300,
        statusCode: statusCode
      };

      // Create new response with formatted data
      const formatted = NextResponse.json(formattedResponse, { status: statusCode });
      
      // Copy cookies from original response
      response.cookies.getAll().forEach(cookie => {
        formatted.cookies.set(cookie.name, cookie.value, cookie);
      });

      return formatted;
    } catch (error: any) {
      const formattedResponse: ApiResponse = {
        data: null,
        error: error.message || 'Internal server error',
        message: 'An error occurred',
        success: false,
        statusCode: 500
      };

      return NextResponse.json(formattedResponse, { status: 500 });
    }
  };
}
```

---

### 3. Combined Middleware (Auth + Response Format)

**Location:** `lib/middleware/combined.middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './auth.middleware';
import { responseFormatMiddleware } from './response-format.middleware';

type RouteHandler = (
  request: NextRequest,
  userId: string,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

export function protectedRoute(handler: RouteHandler) {
  // First apply auth middleware, then response format middleware
  return responseFormatMiddleware(authMiddleware(handler));
}
```

**Usage:**
```typescript
// Protected route with formatted response
export const GET = protectedRoute(handlerFunction);

// Or combine manually:
export const GET = responseFormatMiddleware(authMiddleware(handlerFunction));
```

---

## API Routes Examples

### Protected Route with Formatted Response (No Params)
**Location:** `app/api/user/profile/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/middleware/combined.middleware';
import { prisma } from '@/lib/prisma-client';

const getProfile = async (request: NextRequest, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found', message: 'User not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ data: user, message: 'Profile retrieved successfully' });
};

export const GET = protectedRoute(getProfile);
```

**Response Format:**
```json
{
  "data": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "error": null,
  "message": "Profile retrieved successfully",
  "success": true,
  "statusCode": 200
}
```

### Protected Route with Formatted Response (With Params)
**Location:** `app/api/tasks/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/middleware/combined.middleware';
import { prisma } from '@/lib/prisma-client';

const getTask = async (request: NextRequest, userId: string, params?: { id?: string }) => {
  const task = await prisma.scheduledTask.findFirst({
    where: {
      id: params?.id,
      userId: userId
    }
  });
  
  if (!task) {
    return NextResponse.json(
      { error: 'Task not found', message: 'Task not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ data: task, message: 'Task retrieved successfully' });
};

export const GET = protectedRoute(getTask);
```

**Response Format:**
```json
{
  "data": {
    "id": "task123",
    "userId": "user123",
    "scheduleType": "DAILY"
  },
  "error": null,
  "message": "Task retrieved successfully",
  "success": true,
  "statusCode": 200
}
```

### Protected POST Route with Formatted Response
**Location:** `app/api/tasks/create/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/middleware/combined.middleware';
import { prisma } from '@/lib/prisma-client';

const createTask = async (request: NextRequest, userId: string) => {
  const body = await request.json();
  
  const task = await prisma.scheduledTask.create({
    data: {
      userId: userId,
      providerConfigId: body.providerConfigId,
      scheduleType: body.scheduleType,
      status: 'PENDING'
    }
  });
  
  return NextResponse.json(
    { data: task, message: 'Task created successfully' },
    { status: 201 }
  );
};

export const POST = protectedRoute(createTask);
```

**Response Format:**
```json
{
  "data": {
    "id": "task123",
    "userId": "user123",
    "scheduleType": "DAILY"
  },
  "error": null,
  "message": "Task created successfully",
  "success": true,
  "statusCode": 201
}
```

### Protected DELETE Route with Formatted Response
**Location:** `app/api/tasks/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/middleware/combined.middleware';
import { prisma } from '@/lib/prisma-client';

const deleteTask = async (request: NextRequest, userId: string, params?: { id?: string }) => {
  const task = await prisma.scheduledTask.findFirst({
    where: {
      id: params?.id,
      userId: userId
    }
  });

  if (!task) {
    return NextResponse.json(
      { error: 'Task not found', message: 'Task not found' },
      { status: 404 }
    );
  }

  await prisma.scheduledTask.delete({ where: { id: params?.id } });
  return NextResponse.json({ data: null, message: 'Task deleted successfully' });
};

export const DELETE = protectedRoute(deleteTask);
```

**Response Format:**
```json
{
  "data": null,
  "error": null,
  "message": "Task deleted successfully",
  "success": true,
  "statusCode": 200
}
```

### Logout with Formatted Response
**Location:** `app/api/auth/logout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/middleware/combined.middleware';
import { prisma } from '@/lib/prisma-client';
import bcrypt from 'bcrypt';

const logout = async (request: NextRequest, userId: string) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Revoke refreshToken
  if (refreshToken) {
    const tokens = await prisma.authToken.findMany({
      where: { userId, tokenType: 'REFRESH_TOKEN', isRevoked: false }
    });
    
    for (const token of tokens) {
      if (await bcrypt.compare(refreshToken, token.token)) {
        await prisma.authToken.update({
          where: { id: token.id },
          data: { isRevoked: true }
        });
      }
    }
  }

  // Get user data
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // Clear cookies
  const response = NextResponse.json({ 
    data: user, 
    message: 'Logged out successfully' 
  });
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  
  return response;
};

export const POST = protectedRoute(logout);
```

**Response Format:**
```json
{
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "error": null,
  "message": "Logged out successfully",
  "success": true,
  "statusCode": 200
}
```

---

### Public Route (No Auth, With Formatted Response)
**Location:** `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { responseFormatMiddleware } from '@/lib/middleware/response-format.middleware';

const login = async (request: NextRequest) => {
  const { email } = await request.json();
  
  // Generate OTP, send email logic here...
  
  return NextResponse.json(
    { data: null, message: 'OTP sent to email' },
    { status: 200 }
  );
};

export const POST = responseFormatMiddleware(login);
```

**Response Format:**
```json
{
  "data": null,
  "error": null,
  "message": "OTP sent to email",
  "success": true,
  "statusCode": 200
}
```

---

### Error Response Example
**When error occurs:**
```json
{
  "data": null,
  "error": "User not found",
  "message": "User not found",
  "success": false,
  "statusCode": 404
}
```

---

## Summary

- **AccessToken**: Short-lived, stateless (JWT only), not stored in database
- **RefreshToken**: Longer-lived, stateful (JWT + database), stored hashed for revocation
- **Middleware**: Auto-refreshes tokens when accessToken expires
- **Logout**: Revokes refreshToken in database and clears cookies
