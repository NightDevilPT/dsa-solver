# Development TODO - DSA Solver Project

## Overview

This document outlines the complete development phases for the DSA Solver project, organized in a logical sequence from database setup to feature implementation.

---

## Phase 1: Database Setup & Prisma Configuration

### 1.1 Prisma Initialization
- ✅ Install Prisma dependencies (`@prisma/client`, `prisma`)
- ✅ Initialize Prisma: `npx prisma init`
- ✅ Configure `DATABASE_URL` in `.env`
- ✅ Set up Prisma schema location

### 1.2 Database Schema Creation
- ✅ Create `User` model with fields: id, email, username, firstName, lastName, avatar, emailVerified, emailVerifiedAt, isActive, createdAt, updatedAt
- ✅ Create `AuthToken` model for refresh token storage
- ✅ Create `ProviderConfig` model
- ✅ Create `EncryptedCredentials` model
- ✅ Create `NotificationConfig` model
- ✅ Create `DailyQuestion` model
- ✅ Create `DailyQuestionLog` model
- ✅ Create `ScheduledTask` model
- ✅ Add all enums (TokenType, TokenPurpose, ProviderType, DeliveryStatus, ScheduleType, TaskStatus, ProblemSelection) - in `schema.prisma`
- ✅ Add indexes and unique constraints
- ✅ **COMPLETED:** Combined all models into `schema.prisma` (Prisma requires all models in one file)

### 1.3 Database Migration
- ✅ Generate Prisma Client: `npm run prisma:generate`
- ✅ Create initial migration: `npm run prisma:migrate`
- ✅ Verify migration files created
- ✅ Prisma client successfully generated and working

### 1.4 Prisma Client Setup
- ✅ Create Prisma client instance: `lib/prisma-client/index.ts`
- ✅ Configure singleton pattern for Prisma client
- ✅ Prisma client tested and working in API routes

**Reference:** `docs/prisma-setup.md`

---

## Phase 2: Authentication System

### 2.1 Core Authentication Types & Interfaces
- ✅ Create `interface/api.interface.ts` with `ApiResponse<T>` interface
- [ ] Create `interface/provider.interface.ts` with `Credentials`, `Problem` interfaces
- ✅ Create `interface/auth.interface.ts` for auth-related types
- ✅ Create `interface/theme.interface.ts` - Theme-related types
- ✅ Create `interface/navigation.interface.ts` - Navigation types

### 2.2 JWT Service & Validation
- ✅ Create `lib/jwt-service/jwt.service.ts`
- ✅ Implement `generateAccessToken(userId)` - Generate JWT accessToken (10 min expiry)
- ✅ Implement `generateRefreshToken(userId)` - Generate JWT refreshToken (12 min expiry)
- ✅ Implement `verifyToken(token)` - Verify JWT token and extract payload
- ✅ Implement `decodeToken(token)` - Decode JWT token without verification
- ✅ Note: Token refresh logic is handled in `auth.middleware.ts` (automatic)
- ✅ Add OTP functions to `lib/utils/otp.ts` - OTP generation (`generateOTP`), hashing (`hashOTP`), verification (`verifyOTP`), and expiry check (`isOTPExpired`)
- ✅ Create `lib/validation/` folder for all Zod schemas
- ✅ Create `lib/validation/otp.schema.ts` - Login and OTP verification schemas

### 2.3 Email Service
- ✅ Create `lib/email-service/email.service.ts` - Main email service using Nodemailer
- ✅ Implement email initialization from environment variables
- ✅ Create `lib/email-service/templates/otp-mail.ts` - OTP email template
- ✅ Create `lib/email-service/templates/welcome-mail.ts` - Welcome email template
- ✅ Implement `sendEmail(to, subject, html, text)` method
- ✅ Configure Gmail service for email delivery
- ✅ Add lazy initialization for email transporter

### 2.4 Middleware Implementation
- ✅ Create `lib/middleware/auth.middleware.ts`
- ✅ Implement token validation logic
- ✅ Implement automatic token refresh
- ✅ Create `lib/middleware/response-format.middleware.ts`
- ✅ Implement response formatting
- ✅ Create `lib/middleware/protected-route.middleware.ts` (protectedRoute)
- ✅ Create `lib/middleware/public-route.middleware.ts` (publicRoute)
- ✅ Set up API structure: `/api/public/*` and `/api/protected/*`

### 2.5 Authentication API Routes
- ✅ Create `app/api/public/auth/login/route.ts` - Request login (generate OTP, create user if doesn't exist, send OTP email)
- ✅ Create `app/api/public/auth/verify-otp/route.ts` - Verify OTP, generate tokens using JWT service, set cookies
- ✅ Create `app/api/protected/auth/logout/route.ts` - Logout and revoke refreshToken
- ✅ Create `app/api/protected/auth/session/route.ts` - Get current session (user data)
- ✅ Create example public route: `app/api/public/health/route.ts`
- ✅ Create example protected route: `app/api/protected/user/profile/route.ts`

### 2.6 Frontend Authentication Components
- ✅ Create `components/shared/login-form.tsx` - Reusable login form component
  - ✅ Implement two-step flow (email input → OTP input)
  - ✅ Use Shadcn UI components (Input, InputOTP, Button, Form, Label)
  - ✅ Integrate with `/api/public/auth/login` and `/api/public/auth/verify-otp`
  - ✅ Add loading states and error handling
  - ✅ Use React Hook Form with Zod validation
  - ✅ Show email input disabled during OTP step
  - ✅ Add toast notifications using Sonner
- ✅ Create `components/context/user-session-context.tsx` - User session context
  - ✅ Implement session fetching logic
  - ✅ Add login modal state management
  - ✅ Handle authentication errors with modal display
  - ✅ Skip modal on auth pages and home page
- ✅ Create `components/provider/user-session-provider/user-session-provider.tsx` - User session provider
- ✅ Create `components/shared/user-avatar.tsx` - Reusable avatar component
- ✅ Create `components/shared/user-menu.tsx` - Reusable user menu dropdown
  - ✅ Support custom trigger, menu items, and display name strategies
  - ✅ Implement logout functionality with context state clearing
- ✅ Create `components/pages/home/_components/user-dropdown.tsx` - User dropdown for home header
- ✅ Update `components/pages/home/_components/home-header.tsx` - Add login/logout functionality
  - ✅ Show login buttons when not authenticated
  - ✅ Show user dropdown when authenticated
  - ✅ Open login modal on login button click
- ✅ Update `components/provider/sidebar-provider/_components/sidebar-footer.tsx` - Use shared UserMenu component
- ✅ Create `lib/api-service/api.service.ts` - Centralized API service using fetch
  - ✅ Implement GET, POST, PUT, DELETE, PATCH methods
  - ✅ Handle request/response formatting
  - ✅ Support cookie management
- ✅ Create `lib/validation/otp.schema.ts` - Zod schemas for login and OTP verification
- ✅ Update `app/[lang]/auth/login/page.tsx` - Use LoginForm component

**Reference:** `docs/database-schema.md`

---

## Phase 3: Provider Service Architecture

### 3.1 Base Provider Service
- [ ] Create `lib/provider-service/base-provider.service.ts`
- [ ] Implement abstract class with common browser management
- [ ] Add shared utilities (waitForElement, extractText, extractElements)
- [ ] Define abstract methods: `login()`, `scrapeDailyQuestion()`

### 3.2 LeetCode Service Implementation
- [ ] Create `lib/provider-service/leetcode.service.ts`
- [ ] Implement `login(credentials)` - LeetCode-specific login logic
- [ ] Implement `scrapeDailyQuestion()` - Scrape LeetCode daily challenge
- [ ] Add LeetCode-specific selectors and URL handling
- [ ] Test LeetCode scraping

### 3.3 GFG Service Implementation
- [ ] Create `lib/provider-service/gfg.service.ts`
- [ ] Implement `login(credentials)` - GFG-specific login logic
- [ ] Implement `scrapeDailyQuestion()` - Scrape GFG daily problem
- [ ] Add GFG-specific selectors and URL handling
- [ ] Test GFG scraping

### 3.4 Provider Factory
- [ ] Create `lib/provider-service/provider-factory.ts`
- [ ] Implement `create(providerType)` method
- [ ] Add provider validation methods
- [ ] Test factory pattern

### 3.5 Credential Encryption Service
- [ ] Create `lib/encryption/credential-encryption.service.ts`
- [ ] Implement AES-256-GCM encryption
- [ ] Implement `encrypt(text)` method
- [ ] Implement `decrypt(encrypted, iv, tag)` method
- [ ] Add environment variable for encryption key

### 3.6 Credential Management Service
- [ ] Create `lib/credential-service/credential.service.ts`
- [ ] Implement `saveCredentials(providerConfigId, email, password)`
- [ ] Implement `getCredentials(providerConfigId)`
- [ ] Test encryption/decryption flow

**Reference:** `docs/scraping-architecture.md`

---

## Phase 4: Daily Question Scraping (Cron Jobs)

### 4.1 Inngest Setup
- [ ] Install Inngest dependencies
- [ ] Create `lib/inngest/client.ts` - Inngest client configuration
- [ ] Create `app/api/inngest/route.ts` - Inngest API route handler
- [ ] Configure Inngest environment variables

### 4.2 Daily Problem Scraping Job
- [ ] Create `lib/inngest/functions/scrape-daily-problems.ts`
- [ ] Implement cron job (daily at 2:00 AM)
- [ ] Iterate through all providers (LeetCode, GFG)
- [ ] Call `scrapeDailyQuestion()` for each provider
- [ ] Store scraped problems in `DailyQuestion` table
- [ ] Handle errors gracefully (log but don't fail entire job)
- [ ] Test cron job execution

### 4.3 Daily Problem Delivery Job
- [ ] Create `lib/inngest/functions/daily-problem-fetch.ts`
- [ ] Implement cron job (daily at midnight)
- [ ] Query active scheduled tasks
- [ ] Get daily problem from database (pre-scraped)
- [ ] Generate email content based on notification config
- [ ] Trigger email sending job
- [ ] Record task execution in `DailyQuestionLog`

### 4.4 Email Sending Job
- [ ] Create `lib/inngest/functions/send-email.ts`
- [ ] Implement email generation based on notification config
- [ ] Create email templates
- [ ] Send email via email service
- [ ] Update `DailyQuestionLog` status

**Reference:** `docs/database-schema.md` (Background Jobs section)

---

## Phase 5: Provider Configuration Management

### 5.1 Provider Configuration API
- [ ] Create `app/api/providers/route.ts` - List user's providers
- [ ] Create `app/api/providers/[provider]/route.ts` - Get/Update provider config
- [ ] Create `app/api/providers/[provider]/credentials/route.ts` - Save credentials
- [ ] Implement credential encryption before storage
- [ ] Add validation for provider types

### 5.2 Notification Configuration API
- [ ] Create `app/api/providers/[provider]/notifications/route.ts`
- [ ] Implement notification settings update
- [ ] Validate notification config options
- [ ] Test notification config CRUD operations

### 5.3 Frontend Provider Configuration Pages
- ✅ Create `app/[lang]/dashboard/providers/page.tsx` - Provider list (placeholder)
- ✅ Create `app/[lang]/dashboard/providers/[provider]/page.tsx` - Provider config (placeholder)
- [ ] Implement provider selection UI
- [ ] Implement credential input form (encrypted)
- [ ] Implement notification settings form
- [ ] Add form validation
- [ ] Add loading and error states

---

## Phase 6: Scheduled Tasks Management

### 6.1 Scheduled Task API
- [ ] Create `app/api/tasks/route.ts` - List/Create tasks
- [ ] Create `app/api/tasks/[id]/route.ts` - Get/Update/Delete task
- [ ] Implement task creation with validation
- [ ] Implement task status management (ACTIVE, PAUSED, etc.)
- [ ] Implement nextRunAt calculation

### 6.2 Frontend Task Management
- [ ] Create `app/[lang]/dashboard/tasks/page.tsx` - Task list
- [ ] Create `app/[lang]/dashboard/tasks/create/page.tsx` - Create task
- [ ] Create `app/[lang]/dashboard/tasks/[id]/page.tsx` - Task details
- [ ] Implement task creation form
- [ ] Implement task scheduling UI (daily, weekly, custom)
- [ ] Implement task status toggle (active/pause)
- [ ] Display task execution history

---

## Phase 7: Daily Question Display & Management

### 7.1 Daily Question API
- [ ] Create `app/api/daily-questions/route.ts` - Get daily questions
- [ ] Create `app/api/daily-questions/[provider]/route.ts` - Get provider's daily question
- [ ] Implement query with date filtering
- [ ] Include problem metadata in response

### 7.2 Frontend Daily Question Pages
- [ ] Create `app/[lang]/dashboard/daily-questions/page.tsx` - Daily questions list
- [ ] Create `app/[lang]/dashboard/daily-questions/[id]/page.tsx` - Question details
- [ ] Display problem description, examples, constraints
- [ ] Show problem difficulty and topics
- [ ] Add link to original problem on provider site

---

## Phase 8: Email Service Integration

### 8.1 Email Service Implementation
- [ ] Create `lib/email-service/email.service.ts`
- [ ] Implement email template system
- [ ] Create templates for:
  - Problem explanation
  - Brute force solution
  - Optimized solution
  - Hints
- [ ] Integrate with email provider (Resend/SendGrid)
- [ ] Test email sending

### 8.2 Email Content Generation
- [ ] Implement content generation based on notification config
- [ ] Add problem description formatting
- [ ] Add code syntax highlighting
- [ ] Add solution explanations
- [ ] Test email rendering

---

## Phase 9: Testing & Quality Assurance

### 9.1 Unit Tests
- [ ] Test authentication service functions
- [ ] Test credential encryption/decryption
- [ ] Test provider service methods
- [ ] Test middleware functions
- [ ] Test API route handlers

### 9.2 Integration Tests
- [ ] Test complete login flow (email → OTP → tokens)
- [ ] Test token refresh flow
- [ ] Test daily problem scraping flow
- [ ] Test provider configuration flow
- [ ] Test scheduled task execution

### 9.3 End-to-End Tests
- [ ] Test user registration/login
- [ ] Test provider configuration
- [ ] Test task creation and execution
- [ ] Test daily question delivery
- [ ] Test email notifications

---

## Phase 10: Error Handling & Logging

### 10.1 Error Handling
- [ ] Implement global error handler
- [ ] Add error logging service
- [ ] Create error response formatter
- [ ] Handle scraping errors gracefully
- [ ] Handle authentication errors

### 10.2 Logging System
- [ ] Set up logging service (Winston/Pino)
- [ ] Add request logging middleware
- [ ] Add error logging
- [ ] Add scraping activity logs
- [ ] Configure log levels

---

## Phase 11: Performance Optimization

### 11.1 Database Optimization
- [ ] Review and optimize database queries
- [ ] Add missing indexes
- [ ] Implement query result caching where appropriate
- [ ] Optimize Prisma queries

### 11.2 Scraping Optimization
- [ ] Implement browser pool management
- [ ] Add rate limiting for scraping
- [ ] Implement request queuing
- [ ] Cache scraped problems

### 11.3 API Optimization
- [ ] Implement response caching
- [ ] Add request rate limiting
- [ ] Optimize middleware performance
- [ ] Add database connection pooling

---

## Phase 12: Security Hardening

### 12.1 Security Measures
- [ ] Review and secure all API endpoints
- [ ] Implement CSRF protection
- [ ] Add rate limiting to authentication endpoints
- [ ] Secure credential storage
- [ ] Review encryption implementation

### 12.2 Input Validation
- [ ] Add Zod schemas for all API inputs
- [ ] Validate email formats
- [ ] Validate OTP codes
- [ ] Sanitize user inputs
- [ ] Validate provider configurations

---

## Phase 13: Documentation & Deployment

### 13.1 Code Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Document API endpoints
- [ ] Document service methods
- [ ] Create API documentation

### 13.2 Deployment Preparation
- [ ] Set up production environment variables
- [ ] Configure production database
- [ ] Set up production email service
- [ ] Configure Inngest for production
- [ ] Set up monitoring and alerting
- [ ] Create deployment scripts

---

## Development Order Recommendation

### Week 1: Foundation
1. Phase 1: Database Setup & Prisma Configuration
2. Phase 2: Authentication System (Core)

### Week 2: Core Services
3. Phase 3: Provider Service Architecture
4. Phase 2: Authentication System (Complete)

### Week 3: Automation
5. Phase 4: Daily Question Scraping (Cron Jobs)
6. Phase 8: Email Service Integration

### Week 4: User Features
7. Phase 5: Provider Configuration Management
8. Phase 6: Scheduled Tasks Management
9. Phase 7: Daily Question Display & Management

### Week 5: Polish & Deploy
10. Phase 9: Testing & Quality Assurance
11. Phase 10: Error Handling & Logging
12. Phase 11: Performance Optimization
13. Phase 12: Security Hardening
14. Phase 13: Documentation & Deployment

---

## Quick Start Checklist

Before starting development:

- ✅ Review all documentation files:
  - `docs/database-schema.md`
  - `docs/scraping-architecture.md`
  - `docs/prisma-setup.md`
- ✅ Set up development environment (Docker, PostgreSQL)
- ✅ Configure environment variables
- ✅ Install all dependencies
- [ ] Set up Git repository
- [ ] Create feature branch

---

## Infrastructure & UI Components (Completed)

### UI Components
- ✅ Shadcn UI components installed and configured
- ✅ Home page components (`components/pages/home/`)
- ✅ Settings page components (`components/pages/settings/`)
- ✅ Sidebar provider components (`components/provider/sidebar-provider/`)
- ✅ Shared components (`components/shared/`)

### Core Infrastructure
- ✅ Theme context implementation (`components/context/theme-context.tsx`)
- ✅ Translation hook (`hooks/useTranslation.ts`)
- ✅ Translation dictionaries (en.json, nl.json)
- ✅ Docker setup (Dockerfile, docker-compose.yaml)
- ✅ Next.js configuration with webpack polling
- ✅ Prisma scripts in package.json
- ✅ Docker management scripts (docker:up, docker:down, docker:clean)

---

## Notes

- Follow the project structure defined in `.cursor/rules/core.mdc`
- Use translations for all user-facing text
- Follow TypeScript strict mode
- Use Shadcn UI components
- Implement proper error handling
- Add loading states for all async operations
- Test with multiple locales (en, nl)

---

**Last Updated:** December 2024
**Status:** Phase 1 (Database) - Completed ✅ | Phase 2 (Authentication) - Completed ✅

## Recent Updates

### Phase 1 Status ✅ COMPLETED
- ✅ All database models created and combined into `schema.prisma`
- ✅ All enums defined in `schema.prisma` (TokenType, TokenPurpose, ProviderType, DeliveryStatus, ScheduleType, TaskStatus, ProblemSelection)
- ✅ Initial migration created and Prisma client generated
- ✅ Prisma client tested and working in all API routes

### Phase 2 Status ✅ COMPLETED
- ✅ API response interface created (`interface/api.interface.ts`)
- ✅ Middleware system implemented:
  - `lib/middleware/auth.middleware.ts` - Token validation and auto-refresh
  - `lib/middleware/response-format.middleware.ts` - Standard API response format
  - `lib/middleware/protected-route.middleware.ts` - Protected routes (auth + format)
  - `lib/middleware/public-route.middleware.ts` - Public routes (format only)
- ✅ JWT service implemented (`lib/jwt-service/jwt.service.ts`)
- ✅ OTP utilities created (`lib/utils/otp.ts`)
- ✅ Validation schemas created (`lib/validation/otp.schema.ts`)
- ✅ Email service implemented (`lib/email-service/email.service.ts`)
  - Nodemailer with Gmail service
  - OTP and Welcome email templates
- ✅ API service created (`lib/api-service/api.service.ts`) - Centralized fetch wrapper
- ✅ Authentication API routes:
  - `app/api/public/auth/login/route.ts` - Request login (generate OTP, create user, send email)
  - `app/api/public/auth/verify-otp/route.ts` - Verify OTP, generate tokens, set cookies
  - `app/api/protected/auth/logout/route.ts` - Logout and revoke refreshToken
  - `app/api/protected/auth/session/route.ts` - Get current session (user data)
- ✅ Frontend authentication components:
  - `components/shared/login-form.tsx` - Reusable two-step login form
  - `components/context/user-session-context.tsx` - User session management
  - `components/provider/user-session-provider/` - Session provider
  - `components/shared/user-avatar.tsx` - Reusable avatar component
  - `components/shared/user-menu.tsx` - Reusable user menu dropdown
  - `components/pages/home/_components/user-dropdown.tsx` - Header user dropdown
  - `components/pages/home/_components/home-header.tsx` - Updated with login/logout
  - `components/provider/sidebar-provider/_components/sidebar-footer.tsx` - Updated to use shared components
- ✅ Login modal functionality - Shows on authentication errors (except home/auth pages)
- ✅ Logout functionality - Clears user state in context

### Next Steps (Phase 3)
1. Implement Provider Service Architecture
2. Create base provider service with abstract methods
3. Implement LeetCode and GFG service implementations
4. Set up provider factory pattern

