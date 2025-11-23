# Problem Format Structure & UI Rendering Guide

This document explains the data format structure for AI-formatted problems and how they are rendered in UI components.

## Table of Contents

1. [Overview](#overview)
2. [Data Structure](#data-structure)
3. [AI Response Format](#ai-response-format)
4. [Database Storage Format](#database-storage-format)
5. [UI Component Mapping](#ui-component-mapping)
6. [HTML Output Examples](#html-output-examples)
7. [Display Configuration](#display-configuration)

---

## Overview

The problem format structure follows a pattern similar to `TemplateConfig` in resume generation:

- **Data Layer**: Structured JSON format (what AI returns)
- **Storage Layer**: JSON fields in database (Prisma)
- **Display Layer**: UI components that consume structured data
- **Config Layer**: Display configuration (controls rendering)

---

## Data Structure

### Core Interfaces

```typescript
// Complete problem data structure
interface FormattedProblem {
  // Basic Info
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  
  // Structured Content
  description: ProblemDescription;
  examples: ProblemExample[];
  constraints: ProblemConstraint[];
  
  // AI-Generated Content
  solutions?: ProblemSolutions;
  explanations?: ProblemExplanations;
  hints?: ProblemHints;
}

// Description with sections
interface ProblemDescription {
  raw: string;
  formatted: string;
  sections: DescriptionSection[];
}

// Solutions structure
interface ProblemSolutions {
  bruteForce?: Solution;
  optimized?: Solution;
  alternative?: Solution[];
}
```

---

## AI Response Format

### Example AI Response

```json
{
  "problem": {
    "description": {
      "raw": "<p>Given an array...</p>",
      "formatted": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "sections": [
        {
          "type": "paragraph",
          "content": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          "order": 1
        },
        {
          "type": "paragraph",
          "content": "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
          "order": 2
        }
      ]
    },
    "examples": [
      {
        "exampleNumber": 1,
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1].",
        "imageUrl": null
      },
      {
        "exampleNumber": 2,
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": null,
        "imageUrl": null
      }
    ],
    "constraints": [
      {
        "constraint": "2 ≤ nums.length ≤ 10^4"
      },
      {
        "constraint": "-10^9 ≤ nums[i] ≤ 10^9"
      },
      {
        "constraint": "-10^9 ≤ target ≤ 10^9"
      },
      {
        "constraint": "Only one valid answer exists."
      }
    ]
  },
  "solutions": {
    "bruteForce": {
      "approach": "Brute Force - Two Nested Loops",
      "language": "typescript",
      "code": "function twoSum(nums: number[], target: number): number[] {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n    return [];\n}",
      "complexity": {
        "time": {
          "notation": "O(n²)",
          "explanation": "We iterate through the array twice, checking all pairs"
        },
        "space": {
          "notation": "O(1)",
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
        },
        {
          "stepNumber": 2,
          "title": "Initialize inner loop",
          "description": "For each element, check all subsequent elements",
          "codeSnippet": "for (let j = i + 1; j < nums.length; j++)"
        },
        {
          "stepNumber": 3,
          "title": "Check sum",
          "description": "If sum equals target, return the indices",
          "codeSnippet": "if (nums[i] + nums[j] === target) return [i, j]"
        }
      ]
    },
    "optimized": {
      "approach": "Hash Map - One Pass",
      "language": "typescript",
      "code": "function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    \n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        \n        if (map.has(complement)) {\n            return [map.get(complement)!, i];\n        }\n        \n        map.set(nums[i], i);\n    }\n    \n    return [];\n}",
      "complexity": {
        "time": {
          "notation": "O(n)",
          "explanation": "Single pass through the array"
        },
        "space": {
          "notation": "O(n)",
          "explanation": "Hash map stores up to n elements"
        }
      },
      "explanation": "Use a hash map to store seen numbers and their indices. For each number, check if its complement exists.",
      "stepByStep": [
        {
          "stepNumber": 1,
          "title": "Create hash map",
          "description": "Store number to index mapping",
          "codeSnippet": "const map = new Map<number, number>();"
        },
        {
          "stepNumber": 2,
          "title": "Iterate through array",
          "description": "For each number, calculate complement",
          "codeSnippet": "const complement = target - nums[i];"
        },
        {
          "stepNumber": 3,
          "title": "Check complement",
          "description": "If complement exists in map, return indices",
          "codeSnippet": "if (map.has(complement)) return [map.get(complement)!, i];"
        },
        {
          "stepNumber": 4,
          "title": "Store current number",
          "description": "Add current number and index to map",
          "codeSnippet": "map.set(nums[i], i);"
        }
      ]
    }
  },
  "explanations": {
    "overview": "This problem requires finding two numbers in an array that sum to a target value. The key insight is using a hash map to achieve O(n) time complexity.",
    "approach": "The optimal approach uses a hash map to store numbers we've seen. For each number, we check if its complement (target - current number) exists in the map.",
    "stepByStep": [
      {
        "step": 1,
        "title": "Understand the problem",
        "description": "We need to find two indices where the sum of values equals target."
      },
      {
        "step": 2,
        "title": "Choose data structure",
        "description": "Use a hash map for O(1) lookup time."
      },
      {
        "step": 3,
        "title": "Implement one-pass solution",
        "description": "Iterate once, storing seen numbers and checking for complements."
      }
    ],
    "keyInsights": [
      "Hash map provides O(1) lookup time",
      "We can solve in one pass instead of nested loops",
      "Store index along with value for quick retrieval"
    ],
    "commonMistakes": [
      "Returning values instead of indices",
      "Using the same element twice",
      "Not handling edge cases (empty array, no solution)"
    ]
  },
  "hints": {
    "progressive": [
      "Think about what information you need to track as you iterate through the array.",
      "Consider using a data structure that allows O(1) lookup time.",
      "For each number, check if you've seen its complement (target - current number) before."
    ],
    "approach": "Use a hash map to store numbers you've seen along with their indices.",
    "dataStructure": "Hash Map / Dictionary",
    "algorithm": "One-pass iteration with complement checking"
  }
}
```

---

## Database Storage Format

### Prisma Model Structure

```prisma
model Problem {
  id          String
  title       String
  difficulty  String
  topics      String[]
  description Json?  // Stores ProblemDescription
  examples    Json?   // Stores ProblemExample[]
  constraints Json?   // Stores ProblemConstraint[]
  solutions   Json?   // Stores ProblemSolutions
  explanations Json?  // Stores ProblemExplanations
  hints       Json?   // Stores ProblemHints
}
```

### Stored JSON Example

```json
{
  "description": {
    "raw": "<p>Given an array...</p>",
    "formatted": "Given an array of integers...",
    "sections": [...]
  },
  "examples": [...],
  "constraints": [...],
  "solutions": {
    "bruteForce": {...},
    "optimized": {...}
  }
}
```

---

## HTML Output Examples

### 1. Problem Description Component

**Input Data:**
```json
{
  "description": {
    "formatted": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "sections": [
      {
        "type": "paragraph",
        "content": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "order": 1
      }
    ]
  }
}
```

**Generated HTML:**
```html
<div class="problem-description">
  <div class="description-content">
    <p class="description-paragraph">
      Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    </p>
  </div>
</div>
```

**With Shadcn UI Components:**
```tsx
<div className="space-y-4">
  <Label className="text-lg font-semibold">Problem Description</Label>
  <div className="prose dark:prose-invert max-w-none">
    {description.sections.map((section, idx) => (
      <p key={idx} className="text-base leading-relaxed">
        {section.content}
      </p>
    ))}
  </div>
</div>
```

---

### 2. Problem Examples Component

**Input Data:**
```json
{
  "examples": [
    {
      "exampleNumber": 1,
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1].",
      "imageUrl": null
    }
  ]
}
```

**Generated HTML:**
```html
<div class="problem-examples">
  <h3 class="examples-title">Examples</h3>
  
  <div class="example-card">
    <div class="example-header">
      <span class="example-number">Example 1:</span>
    </div>
    
    <div class="example-content">
      <div class="example-input">
        <Label class="input-label">Input:</Label>
        <code class="input-code">nums = [2,7,11,15], target = 9</code>
      </div>
      
      <div class="example-output">
        <Label class="output-label">Output:</Label>
        <code class="output-code">[0,1]</code>
      </div>
      
      <div class="example-explanation">
        <Label class="explanation-label">Explanation:</Label>
        <p class="explanation-text">
          Because nums[0] + nums[1] == 9, we return [0, 1].
        </p>
      </div>
    </div>
  </div>
</div>
```

**With Shadcn UI Components:**
```tsx
<div className="space-y-6">
  <Label className="text-lg font-semibold">Examples</Label>
  
  {examples.map((example) => (
    <Card key={example.exampleNumber} className="p-6">
      <CardHeader>
        <CardTitle className="text-base">
          Example {example.exampleNumber}:
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Input:
          </Label>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto">
            <code>{example.input}</code>
          </pre>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Output:
          </Label>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto">
            <code>{example.output}</code>
          </pre>
        </div>
        
        {example.explanation && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Explanation:
            </Label>
            <p className="text-sm">{example.explanation}</p>
          </div>
        )}
        
        {example.imageUrl && (
          <div className="space-y-2">
            <img 
              src={example.imageUrl} 
              alt={`Example ${example.exampleNumber} visualization`}
              className="rounded-md border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>
```

---

### 3. Constraints Component

**Input Data:**
```json
{
  "constraints": [
    {
      "constraint": "2 ≤ nums.length ≤ 10^4"
    },
    {
      "constraint": "-10^9 ≤ nums[i] ≤ 10^9"
    }
  ]
}
```

**Generated HTML:**
```html
<div class="problem-constraints">
  <h3 class="constraints-title">Constraints</h3>
  <ul class="constraints-list">
    <li class="constraint-item">
      <span class="constraint-text">2 ≤ nums.length ≤ 10^4</span>
    </li>
    <li class="constraint-item">
      <span class="constraint-text">-10^9 ≤ nums[i] ≤ 10^9</span>
    </li>
  </ul>
</div>
```

**With Shadcn UI Components:**
```tsx
<div className="space-y-4">
  <Label className="text-lg font-semibold">Constraints</Label>
  <ul className="space-y-2 list-disc list-inside">
    {constraints.map((constraint, idx) => (
      <li key={idx} className="text-sm">
        <code className="bg-muted px-2 py-1 rounded text-xs">
          {constraint.constraint}
        </code>
      </li>
    ))}
  </ul>
</div>
```

---

### 4. Solution Viewer Component

**Input Data:**
```json
{
  "solutions": {
    "optimized": {
      "approach": "Hash Map - One Pass",
      "language": "typescript",
      "code": "function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    // ...\n}",
      "complexity": {
        "time": {
          "notation": "O(n)",
          "explanation": "Single pass through the array"
        },
        "space": {
          "notation": "O(n)",
          "explanation": "Hash map stores up to n elements"
        }
      }
    }
  }
}
```

**Generated HTML:**
```html
<div class="solution-viewer">
  <div class="solution-header">
    <h3 class="solution-title">Optimized Solution</h3>
    <div class="solution-meta">
      <span class="approach-badge">Hash Map - One Pass</span>
      <span class="language-badge">TypeScript</span>
    </div>
  </div>
  
  <div class="solution-complexity">
    <div class="complexity-item">
      <Label class="complexity-label">Time Complexity:</Label>
      <code class="complexity-value">O(n)</code>
      <span class="complexity-explanation">Single pass through the array</span>
    </div>
    <div class="complexity-item">
      <Label class="complexity-label">Space Complexity:</Label>
      <code class="complexity-value">O(n)</code>
      <span class="complexity-explanation">Hash map stores up to n elements</span>
    </div>
  </div>
  
  <div class="solution-code">
    <pre class="code-block">
      <code class="language-typescript">
function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    // ...
}
      </code>
    </pre>
  </div>
</div>
```

**With Shadcn UI Components:**
```tsx
<Card className="p-6">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">Optimized Solution</CardTitle>
      <div className="flex gap-2">
        <Badge variant="secondary">{solution.approach}</Badge>
        <Badge variant="outline">{solution.language}</Badge>
      </div>
    </div>
  </CardHeader>
  
  <CardContent className="space-y-4">
    {/* Complexity Analysis */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Time Complexity</Label>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono">{solution.complexity.time.notation}</code>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              {solution.complexity.time.explanation}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Space Complexity</Label>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono">{solution.complexity.space.notation}</code>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              {solution.complexity.space.explanation}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
    
    {/* Code Block */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Solution Code</Label>
        <Button variant="ghost" size="sm">
          <CopyIcon className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code className="text-sm font-mono">{solution.code}</code>
      </pre>
    </div>
  </CardContent>
</Card>
```

---

### 5. Step-by-Step Explanation Component

**Input Data:**
```json
{
  "explanations": {
    "stepByStep": [
      {
        "step": 1,
        "title": "Create hash map",
        "description": "Store number to index mapping",
        "codeSnippet": "const map = new Map<number, number>();"
      },
      {
        "step": 2,
        "title": "Iterate through array",
        "description": "For each number, calculate complement",
        "codeSnippet": "const complement = target - nums[i];"
      }
    ]
  }
}
```

**Generated HTML:**
```html
<div class="step-by-step-explanation">
  <h3 class="explanation-title">Step-by-Step Explanation</h3>
  
  <div class="steps-container">
    <div class="step-item">
      <div class="step-number">1</div>
      <div class="step-content">
        <h4 class="step-title">Create hash map</h4>
        <p class="step-description">Store number to index mapping</p>
        <pre class="step-code">
          <code>const map = new Map<number, number>();</code>
        </pre>
      </div>
    </div>
    
    <div class="step-item">
      <div class="step-number">2</div>
      <div class="step-content">
        <h4 class="step-title">Iterate through array</h4>
        <p class="step-description">For each number, calculate complement</p>
        <pre class="step-code">
          <code>const complement = target - nums[i];</code>
        </pre>
      </div>
    </div>
  </div>
</div>
```

**With Shadcn UI Components:**
```tsx
<div className="space-y-6">
  <Label className="text-lg font-semibold">Step-by-Step Explanation</Label>
  
  <div className="space-y-4">
    {explanations.stepByStep.map((step, idx) => (
      <div key={idx} className="flex gap-4">
        <div className="shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {step.step}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <Label className="text-base font-medium">{step.title}</Label>
          <p className="text-sm text-muted-foreground">{step.description}</p>
          
          {step.codeSnippet && (
            <pre className="bg-muted p-3 rounded-md overflow-x-auto">
              <code className="text-xs font-mono">{step.codeSnippet}</code>
            </pre>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
```

---

### 6. Progressive Hints Component

**Input Data:**
```json
{
  "hints": {
    "progressive": [
      "Think about what information you need to track as you iterate through the array.",
      "Consider using a data structure that allows O(1) lookup time.",
      "For each number, check if you've seen its complement (target - current number) before."
    ],
    "approach": "Use a hash map to store numbers you've seen along with their indices."
  }
}
```

**Generated HTML:**
```html
<div class="progressive-hints">
  <h3 class="hints-title">Hints</h3>
  
  <div class="hints-container">
    <div class="hint-item locked">
      <div class="hint-level">Hint 1</div>
      <button class="unlock-button">Reveal Hint</button>
    </div>
    
    <div class="hint-item unlocked">
      <div class="hint-level">Hint 1</div>
      <p class="hint-text">
        Think about what information you need to track as you iterate through the array.
      </p>
    </div>
  </div>
</div>
```

**With Shadcn UI Components:**
```tsx
<Card className="p-6">
  <CardHeader>
    <CardTitle className="text-lg">Hints</CardTitle>
    <CardDescription>
      Progressive hints to help you solve the problem
    </CardDescription>
  </CardHeader>
  
  <CardContent className="space-y-4">
    {hints.progressive.map((hint, idx) => (
      <div key={idx} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Hint {idx + 1}</Label>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => unlockHint(idx)}
          >
            {isUnlocked(idx) ? "Hide" : "Reveal"}
          </Button>
        </div>
        
        {isUnlocked(idx) && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">{hint}</p>
          </div>
        )}
      </div>
    ))}
    
    <Separator />
    
    <div className="space-y-2">
      <Label className="text-sm font-medium">Approach Hint</Label>
      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm">{hints.approach}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

### 7. Complete Problem Page Layout

**Full HTML Structure:**
```html
<div class="problem-page">
  <!-- Header -->
  <div class="problem-header">
    <h1 class="problem-title">Two Sum</h1>
    <div class="problem-meta">
      <Badge class="difficulty-badge">Easy</Badge>
      <div class="topics">
        <Badge>Array</Badge>
        <Badge>Hash Table</Badge>
      </div>
    </div>
  </div>
  
  <!-- Description -->
  <section class="problem-section">
    <ProblemDescription description={problem.description} />
  </section>
  
  <!-- Examples -->
  <section class="problem-section">
    <ProblemExamples examples={problem.examples} />
  </section>
  
  <!-- Constraints -->
  <section class="problem-section">
    <ProblemConstraints constraints={problem.constraints} />
  </section>
  
  <!-- Solutions (Tabs) -->
  <section class="problem-section">
    <Tabs>
      <TabsList>
        <TabsTrigger value="brute-force">Brute Force</TabsTrigger>
        <TabsTrigger value="optimized">Optimized</TabsTrigger>
      </TabsList>
      <TabsContent value="brute-force">
        <SolutionViewer solution={solutions.bruteForce} />
      </TabsContent>
      <TabsContent value="optimized">
        <SolutionViewer solution={solutions.optimized} />
      </TabsContent>
    </Tabs>
  </section>
  
  <!-- Explanations (Accordion) -->
  <section class="problem-section">
    <Accordion>
      <AccordionItem value="explanation">
        <AccordionTrigger>Detailed Explanation</AccordionTrigger>
        <AccordionContent>
          <StepByStepExplanation steps={explanations.stepByStep} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
  
  <!-- Hints -->
  <section class="problem-section">
    <ProgressiveHints hints={hints} />
  </section>
</div>
```

---

## Display Configuration

**Note**: We use the data structure interfaces directly to generate UI components. No separate display configuration is needed - all sections are rendered based on the data structure provided.

The interfaces in `interface/problem.interface.ts` define the data format, and UI components consume this structured data directly to render the problem display.

---

## Component Mapping

| Data Structure | UI Component | Shadcn Components Used |
|---------------|-------------|------------------------|
| `ProblemDescription` | `<ProblemDescription />` | `Label`, `Card`, `CardContent` |
| `ProblemExample[]` | `<ProblemExamples />` | `Card`, `Label`, `Badge`, `pre`, `code` |
| `ProblemConstraint[]` | `<ProblemConstraints />` | `Label`, `ul`, `li`, `code` |
| `ProblemSolutions` | `<SolutionViewer />` | `Card`, `Tabs`, `Badge`, `Button`, `Tooltip` |
| `ProblemExplanations` | `<StepByStepExplanation />` | `Card`, `Label`, `Accordion` |
| `ProblemHints` | `<ProgressiveHints />` | `Card`, `Button`, `Separator` |

---

## Benefits of This Structure

1. **Structured Data**: AI returns consistent JSON format
2. **UI-Ready**: Direct mapping to React components
3. **Configurable**: Display config controls rendering
4. **Type-Safe**: Full TypeScript support
5. **Reusable**: Same data, different layouts
6. **Extensible**: Easy to add new sections

---

## Visual Example: Complete Rendered Output

### Full Problem Page HTML Structure

```html
<!-- Complete Problem Page -->
<div class="problem-page-container">
  
  <!-- Problem Header -->
  <div class="problem-header-section">
    <h1 class="text-3xl font-bold">Two Sum</h1>
    <div class="flex gap-2 items-center mt-2">
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        Easy
      </span>
      <div class="flex gap-2">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          Array
        </span>
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          Hash Table
        </span>
      </div>
    </div>
  </div>

  <!-- Description Section -->
  <section class="problem-section">
    <h2 class="text-xl font-semibold mb-4">Description</h2>
    <div class="prose max-w-none">
      <p class="text-base leading-relaxed">
        Given an array of integers nums and an integer target, return indices 
        of the two numbers such that they add up to target.
      </p>
      <p class="text-base leading-relaxed mt-4">
        You may assume that each input would have exactly one solution, and you 
        may not use the same element twice.
      </p>
    </div>
  </section>

  <!-- Examples Section -->
  <section class="problem-section">
    <h2 class="text-xl font-semibold mb-4">Examples</h2>
    
    <div class="example-card border rounded-lg p-6 mb-4">
      <h3 class="font-medium mb-4">Example 1:</h3>
      
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium text-gray-600">Input:</label>
          <pre class="bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
            <code>nums = [2,7,11,15], target = 9</code>
          </pre>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-600">Output:</label>
          <pre class="bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
            <code>[0,1]</code>
          </pre>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-600">Explanation:</label>
          <p class="text-sm mt-1">
            Because nums[0] + nums[1] == 9, we return [0, 1].
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Constraints Section -->
  <section class="problem-section">
    <h2 class="text-xl font-semibold mb-4">Constraints</h2>
    <ul class="list-disc list-inside space-y-2">
      <li>
        <code class="bg-gray-100 px-2 py-1 rounded text-sm">
          2 ≤ nums.length ≤ 10^4
        </code>
      </li>
      <li>
        <code class="bg-gray-100 px-2 py-1 rounded text-sm">
          -10^9 ≤ nums[i] ≤ 10^9
        </code>
      </li>
      <li>
        <code class="bg-gray-100 px-2 py-1 rounded text-sm">
          -10^9 ≤ target ≤ 10^9
        </code>
      </li>
    </ul>
  </section>

  <!-- Solutions Section (Tabs) -->
  <section class="problem-section">
    <h2 class="text-xl font-semibold mb-4">Solutions</h2>
    
    <div class="tabs-container">
      <div class="tabs-list border-b">
        <button class="tab-trigger active">Brute Force</button>
        <button class="tab-trigger">Optimized</button>
      </div>
      
      <div class="tab-content">
        <div class="solution-card border rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Brute Force Solution</h3>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                Two Nested Loops
              </span>
              <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                TypeScript
              </span>
            </div>
          </div>
          
          <div class="complexity-grid grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs text-gray-600">Time Complexity</label>
              <div class="flex items-center gap-2">
                <code class="text-sm font-mono">O(n²)</code>
                <span class="text-xs text-gray-500">
                  We iterate through the array twice
                </span>
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-600">Space Complexity</label>
              <div class="flex items-center gap-2">
                <code class="text-sm font-mono">O(1)</code>
                <span class="text-xs text-gray-500">
                  Only using constant extra space
                </span>
              </div>
            </div>
          </div>
          
          <div class="code-block">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium">Solution Code</label>
              <button class="text-sm text-blue-600 hover:underline">
                Copy
              </button>
            </div>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code class="text-sm">
function twoSum(nums: number[], target: number): number[] {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Step-by-Step Explanation -->
  <section class="problem-section">
    <h2 class="text-xl font-semibold mb-4">Step-by-Step Explanation</h2>
    
    <div class="steps-container space-y-4">
      <div class="step-item flex gap-4">
        <div class="step-number-circle shrink-0">
          <span class="text-white font-semibold">1</span>
        </div>
        <div class="step-content flex-1">
          <h4 class="font-medium mb-1">Create hash map</h4>
          <p class="text-sm text-gray-600 mb-2">
            Store number to index mapping
          </p>
          <pre class="bg-gray-100 p-2 rounded text-xs">
            <code>const map = new Map<number, number>();</code>
          </pre>
        </div>
      </div>
      
      <div class="step-item flex gap-4">
        <div class="step-number-circle">
          <span class="text-white font-semibold">2</span>
        </div>
        <div class="step-content flex-1">
          <h4 class="font-medium mb-1">Iterate through array</h4>
          <p class="text-sm text-gray-600 mb-2">
            For each number, calculate complement
          </p>
          <pre class="bg-gray-100 p-2 rounded text-xs">
            <code>const complement = target - nums[i];</code>
          </pre>
        </div>
      </div>
    </div>
  </section>

  <!-- Hints Section -->
  <section class="problem-section">
    <h2 class="text-xl font-semibold mb-4">Hints</h2>
    
    <div class="hints-container space-y-3">
      <div class="hint-item border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium">Hint 1</label>
          <button class="text-sm text-blue-600 hover:underline">
            Reveal
          </button>
        </div>
        <div class="bg-gray-50 p-3 rounded">
          <p class="text-sm">
            Think about what information you need to track as you iterate 
            through the array.
          </p>
        </div>
      </div>
      
      <div class="hint-item border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium">Approach Hint</label>
        </div>
        <div class="bg-gray-50 p-3 rounded">
          <p class="text-sm">
            Use a hash map to store numbers you've seen along with their indices.
          </p>
        </div>
      </div>
    </div>
  </section>

</div>
```

### Rendered Visual Output

```
┌─────────────────────────────────────────────────────────┐
│  Two Sum                                    [Easy]      │
│                          [Array] [Hash Table]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Description                                            │
│  ────────────────────────────────────────────────────  │
│  Given an array of integers nums and an integer        │
│  target, return indices of the two numbers such that   │
│  they add up to target.                                 │
│                                                         │
│  You may assume that each input would have exactly     │
│  one solution, and you may not use the same element    │
│  twice.                                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Examples                                               │
│  ────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Example 1:                                       │   │
│  │                                                  │   │
│  │ Input:                                           │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ nums = [2,7,11,15], target = 9              │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │ Output:                                          │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ [0,1]                                       │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │ Explanation:                                     │   │
│  │ Because nums[0] + nums[1] == 9, we return      │   │
│  │ [0, 1].                                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Constraints                                            │
│  ────────────────────────────────────────────────────  │
│  • 2 ≤ nums.length ≤ 10^4                              │
│  • -10^9 ≤ nums[i] ≤ 10^9                              │
│  • -10^9 ≤ target ≤ 10^9                                │
│  • Only one valid answer exists.                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Solutions                          [Brute Force] [Opt] │
│  ────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Optimized Solution    [Hash Map] [TypeScript]   │   │
│  │                                                  │   │
│  │ Time: O(n)    Space: O(n)                       │   │
│  │                                                  │   │
│  │ Solution Code                          [Copy]   │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ function twoSum(nums, target) {            │ │   │
│  │ │     const map = new Map();                 │ │   │
│  │ │     for (let i = 0; i < nums.length; i++) │ │   │
│  │ │     { ... }                                │ │   │
│  │ │ }                                          │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step-by-Step Explanation                               │
│  ────────────────────────────────────────────────────  │
│  [1] Create hash map                                    │
│      Store number to index mapping                      │
│      const map = new Map<number, number>();            │
│                                                         │
│  [2] Iterate through array                              │
│      For each number, calculate complement             │
│      const complement = target - nums[i];              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Hints                                                  │
│  ────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Hint 1                              [Reveal]     │   │
│  │ Think about what information you need to track  │   │
│  │ as you iterate through the array.               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. Define interfaces in `interface/problem.interface.ts`
2. Create AI service to format scraped data
3. Create UI components that consume structured data
4. Implement display configuration system
5. Store formatted data in database JSON fields

