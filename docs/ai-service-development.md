# AI Service Development Pattern

## Overview

This document defines the development pattern and architecture for implementing AI services (OpenAI, Gemini, Groq, OpenRouter) to format scraped problems and generate solutions, explanations, and hints in the DSA Solver application.

---

## Architecture Pattern

### 1. **Direct AI Call with Structured Prompts**

We use direct AI API calls with structured prompts and JSON mode:
- **Direct API calls** to AI providers (OpenAI, OpenRouter, Groq, etc.)
- **Structured prompts** with explicit JSON schema requirements
- **JSON mode** for consistent structured output
- **Zod validation** for response parsing and type safety
- **Custom endpoints** support multiple providers

### 2. **Abstract Base Class Pattern**

All AI services extend a common `BaseAIService` class that provides:
- Shared API client initialization
- Common prompt building utilities
- Response parsing and validation with Zod
- Error handling and retry logic
- Abstract methods that each AI provider must implement

### 3. **Factory Pattern**

An `AIServiceFactory` creates the appropriate AI service instance based on provider type, ensuring type safety and easy extensibility.

### 4. **Response Validation**

All AI responses are validated using Zod schemas:
- Parse JSON response from AI
- Validate against expected interface
- Type-safe data transformation
- Automatic error handling for invalid responses

---

## File Structure

```
lib/
├── ai-service/
│   ├── base/
│   │   ├── base-ai.service.ts          # Abstract base class
│   │   ├── prompts/
│   │   │   ├── problem-format.prompt.ts # Problem formatting prompt
│   │   │   ├── solution.prompt.ts       # Solution generation prompt
│   │   │   ├── explanation.prompt.ts   # Explanation generation prompt
│   │   │   └── hints.prompt.ts         # Hints generation prompt
│   │   └── schemas/
│   │       ├── ai-response.schema.ts   # Zod schemas for validation
│   │       └── solution.schema.ts      # Solution response schema
│   │
│   ├── providers/
│   │   ├── openai.service.ts           # OpenAI implementation
│   │   ├── gemini.service.ts           # Google Gemini implementation
│   │   ├── groq.service.ts             # Groq implementation
│   │   └── openrouter.service.ts      # OpenRouter implementation
│   │
│   ├── ai-service-factory.ts           # Factory for creating AI services
│   └── ai.service.ts                   # Main AI service (uses factory)
│
interface/
└── ai.interface.ts                      # AI service interfaces

app/api/
├── protected/
│   └── ai/
│       ├── format-problem/
│       │   └── route.ts                # POST: Format problem with AI
│       ├── generate-solutions/
│       │   └── route.ts                # POST: Generate solutions
│       ├── generate-explanations/
│       │   └── route.ts                # POST: Generate explanations
│       └── generate-hints/
│           └── route.ts                # POST: Generate hints
```

---

## Base AI Service

### Abstract Methods

```typescript
import { z } from 'zod';
import type { Problem, FormattedProblem, ProblemSolutions, ProblemExplanations, ProblemHints } from '@/interface/problem.interface';

abstract class BaseAIService {
  // Initialize AI client
  protected abstract initializeClient(): Promise<void>;
  
  // Get client configuration (endpoint, model, etc.)
  protected abstract getClientConfig(): {
    baseURL?: string;
    apiKey: string;
    model: string;
    defaultHeaders?: Record<string, string>;
  };
  
  // Format problem description, examples, constraints
  abstract formatProblem(
    rawProblem: Problem,
    options?: AIFormatOptions
  ): Promise<AIFormatResponse>;
  
  // Generate solutions
  abstract generateSolutions(
    problem: FormattedProblem,
    languages: string[]
  ): Promise<ProblemSolutions>;
  
  // Generate explanations
  abstract generateExplanations(
    problem: FormattedProblem,
    solutions: ProblemSolutions,
    depth: "basic" | "intermediate" | "advanced"
  ): Promise<ProblemExplanations>;
  
  // Generate hints
  abstract generateHints(
    problem: FormattedProblem,
    count: number
  ): Promise<ProblemHints>;
}
```

### Common Utilities Implementation

**File:** `lib/ai-service/base/base-ai.service.ts`

```typescript
import { z } from 'zod';
import type { Problem, FormattedProblem, ProblemSolutions, ProblemExplanations, ProblemHints } from '@/interface/problem.interface';
import type { AIFormatOptions, AIFormatResponse } from '@/interface/ai.interface';

export abstract class BaseAIService {
  // Initialize AI client
  protected abstract initializeClient(): Promise<void>;
  
  // Get client configuration
  protected abstract getClientConfig(): {
    baseURL?: string;
    apiKey: string;
    model: string;
    defaultHeaders?: Record<string, string>;
  };
  
  // Abstract methods
  abstract formatProblem(
    rawProblem: Problem,
    options?: AIFormatOptions
  ): Promise<AIFormatResponse>;
  
  abstract generateSolutions(
    problem: FormattedProblem,
    languages: string[]
  ): Promise<ProblemSolutions>;
  
  abstract generateExplanations(
    problem: FormattedProblem,
    solutions: ProblemSolutions,
    depth: "basic" | "intermediate" | "advanced"
  ): Promise<ProblemExplanations>;
  
  abstract generateHints(
    problem: FormattedProblem,
    count: number
  ): Promise<ProblemHints>;
  
  // Common utility: Build prompt from template
  protected buildPrompt(template: string, data: any): string {
    // Replace placeholders in template with actual data
    let prompt = template;
    
    // Replace common placeholders
    if (data.title) prompt = prompt.replace('{{title}}', data.title);
    if (data.description) prompt = prompt.replace('{{description}}', data.description);
    if (data.examples) prompt = prompt.replace('{{examples}}', JSON.stringify(data.examples));
    if (data.constraints) prompt = prompt.replace('{{constraints}}', JSON.stringify(data.constraints));
    
    // Add data as JSON context
    prompt += `\n\nInput Data:\n${JSON.stringify(data, null, 2)}`;
    
    return prompt;
  }
  
  // Common utility: Parse and validate JSON response
  protected parseAndValidate<T>(
    content: string,
    schema: z.ZodSchema<T>
  ): T {
    try {
      const jsonData = JSON.parse(content);
      return schema.parse(jsonData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }
  
  // Common utility: Retry with exponential backoff
  protected async retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await this.delay(delay * Math.pow(2, i));
        }
      }
    }
    
    throw lastError!;
  }
  
  // Common utility: Delay helper
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Common utility: Handle errors
  protected handleError(error: any, context: string): never {
    const message = error?.message || 'Unknown error';
    throw new Error(`AI Service Error (${context}): ${message}`);
  }
}
```

---

## AI Provider Implementations

### 1. OpenAI Service

**Configuration:**
```typescript
// Environment variables
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini  // or gpt-4o, gpt-3.5-turbo
```

**Implementation Pattern:**
```typescript
import OpenAI from 'openai';
import { z } from 'zod';
import { PROBLEM_FORMAT_PROMPT } from '../base/prompts/problem-format.prompt';
import { AIProblemResponseSchema } from '../base/schemas/ai-response.schema';

class OpenAIService extends BaseAIService {
  private client: OpenAI;
  
  protected async initializeClient(): Promise<void> {
    const config = this.getClientConfig();
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }
  
  protected getClientConfig() {
    return {
      apiKey: process.env.OPENAI_API_KEY!,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }
  
  async formatProblem(rawProblem: Problem): Promise<AIFormatResponse> {
    const prompt = this.buildPrompt(PROBLEM_FORMAT_PROMPT, rawProblem);
    const config = this.getClientConfig();
    
    const response = await this.client.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content from AI");
    }
    
    const jsonData = JSON.parse(content);
    const validated = AIProblemResponseSchema.parse(jsonData);
    
    return {
      success: true,
      data: validated,
      processingTime: response.usage?.total_tokens || 0,
    };
  }
}
```

### 2. Gemini Service

**Configuration:**
```typescript
// Environment variables
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash-exp  // or gemini-1.5-pro
```

**Implementation Pattern:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROBLEM_FORMAT_PROMPT } from '../base/prompts/problem-format.prompt';
import { AIProblemResponseSchema } from '../base/schemas/ai-response.schema';

class GeminiService extends BaseAIService {
  private client: GoogleGenerativeAI;
  
  protected async initializeClient(): Promise<void> {
    this.client = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );
  }
  
  protected getClientConfig() {
    return {
      apiKey: process.env.GEMINI_API_KEY!,
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
    };
  }
  
  async formatProblem(rawProblem: Problem): Promise<AIFormatResponse> {
    const prompt = this.buildPrompt(PROBLEM_FORMAT_PROMPT, rawProblem);
    const config = this.getClientConfig();
    
    const model = this.client.getGenerativeModel({
      model: config.model,
    });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });
    
    const content = result.response.text();
    if (!content) {
      throw new Error("No response content from AI");
    }
    
    const jsonData = JSON.parse(content);
    const validated = AIProblemResponseSchema.parse(jsonData);
    
    return {
      success: true,
      data: validated,
      processingTime: result.response.usageMetadata?.totalTokenCount || 0,
    };
  }
}
```

### 3. Groq Service

**Configuration:**
```typescript
// Environment variables
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-8b-instant  // or llama-3.1-70b-versatile
```

**Implementation Pattern:**
```typescript
import OpenAI from 'openai';
import { z } from 'zod';
import { PROBLEM_FORMAT_PROMPT } from '../base/prompts/problem-format.prompt';
import { AIProblemResponseSchema } from '../base/schemas/ai-response.schema';

class GroqService extends BaseAIService {
  private client: OpenAI; // Groq uses OpenAI-compatible API
  
  protected async initializeClient(): Promise<void> {
    const config = this.getClientConfig();
    this.client = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: config.apiKey,
    });
  }
  
  protected getClientConfig() {
    return {
      apiKey: process.env.GROQ_API_KEY!,
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    };
  }
  
  async formatProblem(rawProblem: Problem): Promise<AIFormatResponse> {
    const prompt = this.buildPrompt(PROBLEM_FORMAT_PROMPT, rawProblem);
    const config = this.getClientConfig();
    
    const response = await this.client.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content from AI");
    }
    
    const jsonData = JSON.parse(content);
    const validated = AIProblemResponseSchema.parse(jsonData);
    
    return {
      success: true,
      data: validated,
      processingTime: response.usage?.total_tokens || 0,
    };
  }
}
```

### 4. OpenRouter Service

**Configuration:**
```typescript
// Environment variables
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp  // or any model
```

**Implementation Pattern:**
```typescript
import OpenAI from 'openai';
import { z } from 'zod';
import { PROBLEM_FORMAT_PROMPT } from '../base/prompts/problem-format.prompt';
import { AIProblemResponseSchema } from '../base/schemas/ai-response.schema';

class OpenRouterService extends BaseAIService {
  private client: OpenAI; // OpenRouter uses OpenAI-compatible API
  
  protected async initializeClient(): Promise<void> {
    const config = this.getClientConfig();
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.apiKey,
      defaultHeaders: {
        'HTTP-Referer': process.env.APP_URL || '',
        'X-Title': 'DSA Solver',
      },
    });
  }
  
  protected getClientConfig() {
    return {
      apiKey: process.env.OPENROUTER_API_KEY!,
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp",
    };
  }
  
  async formatProblem(rawProblem: Problem): Promise<AIFormatResponse> {
    const prompt = this.buildPrompt(PROBLEM_FORMAT_PROMPT, rawProblem);
    const config = this.getClientConfig();
    
    const response = await this.client.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content from AI");
    }
    
    const jsonData = JSON.parse(content);
    const validated = AIProblemResponseSchema.parse(jsonData);
    
    return {
      success: true,
      data: validated,
      processingTime: response.usage?.total_tokens || 0,
    };
  }
}
```

---

## Prompt Engineering

### Prompt Structure

All prompts follow this structure:
1. **Role Definition** - Define AI's role and expertise
2. **Task Description** - Clear task description
3. **Input Format** - Expected input structure
4. **Output Format** - Required JSON schema (explicit)
5. **Examples** - Example input/output pairs
6. **Constraints** - Rules and constraints

### Prompt Template Pattern

Prompts use placeholders that are replaced with actual data:
- `{{title}}` - Problem title
- `{{description}}` - Problem description
- `{{examples}}` - Problem examples (JSON)
- `{{constraints}}` - Problem constraints (JSON)
- `{{language}}` - Programming language
- `{{count}}` - Number of items to generate

### 1. Problem Formatting Prompt

**File:** `lib/ai-service/base/prompts/problem-format.prompt.ts`

```typescript
export const PROBLEM_FORMAT_PROMPT = `
You are an expert at formatting coding problems for database storage and UI rendering.

TASK: Format the scraped problem data into a structured JSON format.

INPUT: Raw scraped problem data (may contain HTML, inconsistent formatting)

OUTPUT: Structured JSON matching this exact format:

{
  "problem": {
    "description": {
      "raw": "original text",
      "formatted": "cleaned text without HTML",
      "sections": [
        {
          "type": "paragraph",
          "content": "...",
          "order": 1
        }
      ],
      "wordCount": 150,
      "readingTime": 1,
      "hasMath": false,
      "hasCode": true
    },
    "examples": [
      {
        "exampleNumber": 1,
        "input": "...",
        "output": "...",
        "explanation": "...",
        "imageUrl": null
      }
    ],
    "constraints": [
      {
        "constraint": "1 ≤ n ≤ 10^5"
      }
    ]
  },
  "metadata": {
    "formattedAt": "2025-01-15T10:30:00Z",
    "aiModel": "gemini-2.0-flash-exp",
    "confidence": 0.95,
    "processingTime": 1200
  }
}

REQUIREMENTS:
1. Remove ALL HTML tags from description
2. Structure description into logical sections (paragraph, list, code, math)
3. Parse examples with proper input/output separation
4. Extract constraints as individual items
5. Preserve image URLs if present in examples
6. Format code blocks properly (identify language)
7. Clean mathematical notation
8. Calculate wordCount and readingTime accurately
9. Detect if description contains math or code

EXAMPLE INPUT:
{
  "title": "Two Sum",
  "description": "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>",
  "examples": "Example 1: Input: nums = [2,7,11,15], target = 9 Output: [0,1]",
  "constraints": "2 ≤ nums.length ≤ 10^4"
}

EXAMPLE OUTPUT:
{
  "problem": {
    "description": {
      "raw": "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>",
      "formatted": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "sections": [
        {
          "type": "paragraph",
          "content": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          "order": 1
        }
      ],
      "wordCount": 20,
      "readingTime": 1,
      "hasMath": false,
      "hasCode": true
    },
    "examples": [
      {
        "exampleNumber": 1,
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": null,
        "imageUrl": null
      }
    ],
    "constraints": [
      {
        "constraint": "2 ≤ nums.length ≤ 10^4"
      }
    ]
  }
}
`;
```

### 2. Solution Generation Prompt

**File:** `lib/ai-service/base/prompts/solution.prompt.ts`

```typescript
export const SOLUTION_GENERATION_PROMPT = `
You are an expert algorithm developer and coding instructor.

TASK: Generate multiple solution approaches for a coding problem.

INPUT: Formatted problem data with description, examples, and constraints.

OUTPUT: Structured JSON with solutions:

{
  "solutions": {
    "bruteForce": {
      "approach": "Brute Force - Two Nested Loops",
      "language": "typescript",
      "code": "function twoSum(nums: number[], target: number): number[] { ... }",
      "complexity": {
        "time": {
          "notation": "O(n²)",
          "best": "O(n²)",
          "average": "O(n²)",
          "worst": "O(n²)",
          "explanation": "We iterate through the array twice, checking all pairs"
        },
        "space": {
          "notation": "O(1)",
          "best": "O(1)",
          "average": "O(1)",
          "worst": "O(1)",
          "explanation": "Only using constant extra space"
        }
      },
      "explanation": "Check every pair of numbers to find the sum that equals target.",
      "stepByStep": [
        {
          "stepNumber": 1,
          "title": "Initialize outer loop",
          "description": "Iterate through each element in the array",
          "codeSnippet": "for (let i = 0; i < nums.length; i++)"
        }
      ],
      "timeToSolve": 5,
      "difficulty": "easy"
    },
    "optimized": {
      "approach": "Hash Map - One Pass",
      "language": "typescript",
      "code": "...",
      "complexity": {...},
      "explanation": "...",
      "stepByStep": [...],
      "timeToSolve": 3,
      "difficulty": "medium"
    }
  }
}

REQUIREMENTS:
1. Generate at least brute force and optimized solutions
2. Provide complete, runnable code
3. Include detailed complexity analysis
4. Break down solution into clear steps
5. Use the specified programming language
6. Ensure code follows best practices
7. Include time complexity for each approach
8. Estimate solving time in minutes

LANGUAGES TO SUPPORT: {languages}
`;
```

### 3. Explanation Generation Prompt

**File:** `lib/ai-service/base/prompts/explanation.prompt.ts`

```typescript
export const EXPLANATION_GENERATION_PROMPT = `
You are an expert coding instructor and technical writer.

TASK: Generate detailed explanations for a coding problem and its solutions.

INPUT: Formatted problem data and generated solutions.

OUTPUT: Structured JSON with explanations:

{
  "explanations": {
    "overview": "High-level problem understanding",
    "approach": "Main approach explanation",
    "stepByStep": [
      {
        "step": 1,
        "title": "Step title",
        "description": "Detailed step description",
        "codeSnippet": "relevant code"
      }
    ],
    "keyInsights": [
      "Key insight 1",
      "Key insight 2"
    ],
    "commonMistakes": [
      "Common mistake 1",
      "Common mistake 2"
    ],
    "relatedProblems": [
      {
        "title": "Related Problem",
        "url": "https://...",
        "difficulty": "Medium",
        "similarity": 0.8
      }
    ]
  }
}

REQUIREMENTS:
1. Provide clear, beginner-friendly explanations
2. Break down complex concepts into simple steps
3. Highlight key insights and patterns
4. List common mistakes students make
5. Suggest related problems for practice
6. Use appropriate depth level: {depth}
`;
```

### 4. Hints Generation Prompt

**File:** `lib/ai-service/base/prompts/hints.prompt.ts`

```typescript
export const HINTS_GENERATION_PROMPT = `
You are an expert coding mentor.

TASK: Generate progressive hints for a coding problem.

INPUT: Formatted problem data.

OUTPUT: Structured JSON with hints:

{
  "hints": {
    "progressive": [
      "Hint 1: Think about what information you need to track",
      "Hint 2: Consider using a data structure with O(1) lookup",
      "Hint 3: For each number, check if its complement exists"
    ],
    "approach": "Use a hash map to store seen numbers",
    "dataStructure": "Hash Map / Dictionary",
    "algorithm": "One-pass iteration with complement checking"
  }
}

REQUIREMENTS:
1. Generate {count} progressive hints (from subtle to more direct)
2. Each hint should build on the previous one
3. Don't give away the solution immediately
4. Suggest appropriate data structures
5. Suggest relevant algorithms
6. Make hints educational and thought-provoking
`;
```

---

## AI Service Factory

**File:** `lib/ai-service/ai-service-factory.ts`

```typescript
export enum AIProviderType {
  OPENAI = "OPENAI",
  GEMINI = "GEMINI",
  GROQ = "GROQ",
  OPENROUTER = "OPENROUTER",
}

export class AIServiceFactory {
  static create(provider: AIProviderType): BaseAIService {
    switch (provider) {
      case AIProviderType.OPENAI:
        return new OpenAIService();
      case AIProviderType.GEMINI:
        return new GeminiService();
      case AIProviderType.GROQ:
        return new GroqService();
      case AIProviderType.OPENROUTER:
        return new OpenRouterService();
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
  
  static createFromEnv(): BaseAIService {
    const provider = process.env.AI_PROVIDER as AIProviderType;
    if (!provider) {
      throw new Error("AI_PROVIDER environment variable not set");
    }
    return this.create(provider);
  }
}
```

---

## Main AI Service

**File:** `lib/ai-service/ai.service.ts`

```typescript
export class AIService {
  private service: BaseAIService;
  
  constructor(provider?: AIProviderType) {
    this.service = provider
      ? AIServiceFactory.create(provider)
      : AIServiceFactory.createFromEnv();
  }
  
  async formatProblem(
    rawProblem: Problem,
    options?: AIFormatOptions
  ): Promise<AIFormatResponse> {
    return this.service.formatProblem(rawProblem, options);
  }
  
  async generateSolutions(
    problem: FormattedProblem,
    languages: string[]
  ): Promise<ProblemSolutions> {
    return this.service.generateSolutions(problem, languages);
  }
  
  async generateExplanations(
    problem: FormattedProblem,
    solutions: ProblemSolutions,
    depth: "basic" | "intermediate" | "advanced"
  ): Promise<ProblemExplanations> {
    return this.service.generateExplanations(problem, solutions, depth);
  }
  
  async generateHints(
    problem: FormattedProblem,
    count: number
  ): Promise<ProblemHints> {
    return this.service.generateHints(problem, count);
  }
}
```

---

## Environment Variables

```env
# AI Provider Selection
AI_PROVIDER=GEMINI  # OPENAI, GEMINI, GROQ, OPENROUTER

# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Gemini Configuration
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash-exp

# Groq Configuration
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-8b-instant

# OpenRouter Configuration
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp
APP_URL=https://your-app.com  # For OpenRouter headers
```

---

## API Routes

### Format Problem

**File:** `app/api/protected/ai/format-problem/route.ts`

```typescript
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";
import { AIService } from "@/lib/ai-service/ai.service";
import { prisma } from "@/lib/prisma-client";

async function formatProblemHandler(
  request: NextRequest,
  userId: string
) {
  const body = await request.json();
  const { problemId, options } = body;
  
  // Fetch problem from database
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });
  
  if (!problem) {
    return NextResponse.json({
      success: false,
      error: "Problem not found",
    }, { status: 404 });
  }
  
  // Initialize AI service
  const aiService = new AIService();
  
  // Format problem
  const result = await aiService.formatProblem(problem, options);
  
  if (!result.success || !result.data) {
    return NextResponse.json({
      success: false,
      error: result.error,
    }, { status: 500 });
  }
  
  // Update problem in database
  await prisma.problem.update({
    where: { id: problemId },
    data: {
      description: result.data.problem.description,
      examples: result.data.problem.examples,
      constraints: result.data.problem.constraints,
      formattedAt: new Date(),
      aiModel: result.data.metadata.aiModel,
      aiConfidence: result.data.metadata.confidence,
    },
  });
  
  return NextResponse.json({
    success: true,
    data: result.data,
  });
}

export const POST = protectedRoute(formatProblemHandler);
```

---

## Error Handling

### Common Errors

1. **API Key Missing**
   - Check environment variables
   - Provide clear error message

2. **Rate Limiting**
   - Implement exponential backoff
   - Retry with delays

3. **Invalid JSON Response**
   - Validate response structure
   - Retry with stricter prompt

4. **Token Limit Exceeded**
   - Split large problems into chunks
   - Use streaming for long responses

5. **Network Errors**
   - Retry with exponential backoff
   - Log errors for debugging

---

## Best Practices

1. **Prompt Engineering**
   - Use clear, specific instructions
   - Include examples in prompts
   - Specify JSON schema explicitly
   - Use temperature 0.3 for consistent output

2. **Error Handling**
   - Always validate AI responses
   - Implement retry logic
   - Log errors with context
   - Provide fallback behavior

3. **Performance**
   - Cache formatted problems
   - Use streaming for long responses
   - Batch requests when possible
   - Monitor token usage

4. **Cost Optimization**
   - Use cheaper models for simple tasks
   - Cache results to avoid re-processing
   - Monitor API usage
   - Set rate limits

5. **Testing**
   - Test with various problem types
   - Validate JSON structure
   - Check edge cases
   - Monitor response quality

---

## Response Validation with Zod

**File:** `lib/ai-service/base/schemas/ai-response.schema.ts`

```typescript
import { z } from 'zod';

// Zod schema for AI response validation
export const AIProblemResponseSchema = z.object({
  problem: z.object({
    description: z.object({
      raw: z.string(),
      formatted: z.string(),
      sections: z.array(z.object({
        type: z.enum(['paragraph', 'list', 'code', 'math', 'image', 'table']),
        content: z.string(),
        order: z.number(),
        metadata: z.object({
          language: z.string().optional(),
          caption: z.string().optional(),
          level: z.number().optional(),
        }).optional(),
      })),
      wordCount: z.number(),
      readingTime: z.number(),
      hasMath: z.boolean(),
      hasCode: z.boolean(),
    }),
    examples: z.array(z.object({
      exampleNumber: z.number(),
      input: z.string(),
      output: z.string(),
      explanation: z.string().nullable().optional(),
      imageUrl: z.string().nullable().optional(),
    })),
    constraints: z.array(z.object({
      constraint: z.string(),
    })),
  }),
  metadata: z.object({
    formattedAt: z.string().datetime(),
    aiModel: z.string(),
    confidence: z.number().min(0).max(1),
    processingTime: z.number(),
  }),
});
```

## Installation

### Required Packages

```bash
# OpenAI SDK (works with OpenAI, OpenRouter, Groq - all OpenAI-compatible)
npm install openai

# Zod for schema validation (if not already installed)
npm install zod

# Optional: Direct SDKs for specific providers
npm install @google/generative-ai groq
```

### Package.json

```json
{
  "dependencies": {
    "openai": "^6.9.1",
    "zod": "^4.1.12"
  }
}
```

## Benefits of Direct AI Call Approach

1. **Simplicity**: Direct API calls without agent overhead
2. **Type Safety**: Zod schemas validate AI responses
3. **JSON Mode**: Native JSON mode support for structured output
4. **Multi-Provider Support**: Same pattern works with OpenAI-compatible APIs
5. **Performance**: No agent orchestration overhead
6. **Cost Effective**: Single API call per operation
7. **Validation**: Automatic validation of responses with Zod

## Example: Complete Direct AI Call

```typescript
import OpenAI from 'openai';
import { z } from 'zod';

// Define response schema
const ProblemResponseSchema = z.object({
  formatted: z.string(),
  sections: z.array(z.any()),
});

// Create client with custom endpoint
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1', // Custom endpoint
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Make direct API call
const response = await client.chat.completions.create({
  model: 'google/gemini-2.0-flash-exp',
  messages: [{ 
    role: 'user', 
    content: 'Format this problem: Two Sum' 
  }],
  response_format: { type: 'json_object' },
  temperature: 0.3,
});

// Parse and validate response
const content = response.choices[0]?.message?.content;
const jsonData = JSON.parse(content!);
const validated = ProblemResponseSchema.parse(jsonData);

console.log(validated);
```

## Complete Workflow Example

### Step-by-Step: Format a Problem

```typescript
// 1. Initialize AI Service
const aiService = new AIService(); // Uses AI_PROVIDER from env

// 2. Fetch raw problem from database
const rawProblem = await prisma.problem.findUnique({
  where: { id: problemId }
});

// 3. Format problem with AI
const result = await aiService.formatProblem(rawProblem, {
  includeSolutions: false,
  includeExplanations: false,
  includeHints: false,
});

// 4. Validate response (already done by service)
if (!result.success || !result.data) {
  throw new Error(result.error);
}

// 5. Update database with formatted data
await prisma.problem.update({
  where: { id: problemId },
  data: {
    description: result.data.problem.description,
    examples: result.data.problem.examples,
    constraints: result.data.problem.constraints,
    formattedAt: new Date(),
    aiModel: result.data.metadata.aiModel,
    aiConfidence: result.data.metadata.confidence,
  },
});
```

## Next Steps

1. Install required packages:
   ```bash
   npm install openai zod
   # Optional for Gemini
   npm install @google/generative-ai
   ```

2. Set up environment variables

3. Create prompt templates in `lib/ai-service/base/prompts/`

4. Create Zod schemas in `lib/ai-service/base/schemas/`

5. Implement base AI service with common utilities

6. Implement provider-specific services (OpenAI, Gemini, Groq, OpenRouter)

7. Create AI service factory

8. Create API routes

9. Test with sample problems

10. Integrate with problem scraping workflow

