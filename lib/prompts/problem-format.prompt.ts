// Problem Formatting Prompt
// Optimized for minimal token usage while maintaining accuracy
// Includes solutions, explanations, and hints generation

export const PROBLEM_FORMAT_PROMPT = `Format scraped problem data into structured JSON with solutions, explanations, and hints.

INTERFACES:
ProblemDescription {
  raw: string; formatted: string; sections: DescriptionSection[];
  wordCount: number; readingTime: number; hasMath: boolean; hasCode: boolean;
}
DescriptionSection {
  type: "paragraph"|"list"|"code"|"math"|"image"|"table";
  content: string; order: number;
  metadata?: {language?: string; caption?: string; level?: number;}
}
ProblemExample {
  exampleNumber: number; input: string; output: string;
  explanation?: string; imageUrl?: string|null;
}
ProblemConstraint { constraint: string; }
ProblemSolutions {
  bruteForce?: Solution (if provided, must be complete Solution object);
  optimized?: Solution (if provided, must be complete Solution object);
  bestPractice?: Solution (if provided, must be complete Solution object);
  alternative?: Solution[] (array of Solution objects, can be empty array []);
}
Solution {
  id: string; approach: string; language: string; code: string;
  complexity: ComplexityAnalysis (REQUIRED object, not optional);
  explanation: string; stepByStep: SolutionStep[] (array);
  timeToSolve?: number; 
  difficulty: "easy"|"medium"|"hard" (REQUIRED, must be exactly one of these three lowercase strings, no other values);
}
ComplexityAnalysis {
  time: {notation: string; best: string; average: string; worst: string; explanation: string;} (ALL fields required);
  space: {notation: string; best: string; average: string; worst: string; explanation: string;} (ALL fields required);
  tradeoffs?: string (optional);
}
SolutionStep {
  stepNumber: number; title: string; description: string;
  codeSnippet?: string; visualization?: string; keyInsight?: string;
}
ProblemExplanations {
  overview: string; approach: string; stepByStep: ExplanationStep[];
  keyInsights: string[]; commonMistakes: string[]; relatedProblems?: RelatedProblem[];
}
ExplanationStep {
  step: number; title: string; description: string;
  codeSnippet?: string; visualization?: string;
}
RelatedProblem {
  title: string; url: string; difficulty: string; similarity: number;
}
ProblemHints {
  progressive: string[]; approach: string;
  dataStructure?: string; algorithm?: string;
}
AIProblemResponse {
  problem: {description: ProblemDescription; examples: ProblemExample[]; constraints: ProblemConstraint[];};
  solutions?: ProblemSolutions;
  explanations?: ProblemExplanations;
  hints?: ProblemHints;
  metadata: {formattedAt: string; aiModel: string; confidence: number; processingTime: number;};
}

RULES - FORMATTING:
1. description.raw: Keep original HTML text exactly as provided
2. description.formatted: Remove ALL HTML tags, clean text
3. description.sections: Break formatted text into logical sections (paragraph/list/code/math/image/table)
4. description.wordCount: Count words in formatted text
5. description.readingTime: wordCount/200 (minutes, round to nearest integer)
6. description.hasMath: true if contains ≤≥∑∏√^ mathematical symbols
7. description.hasCode: true if contains code snippets or code blocks
8. examples: Process each example - remove ALL HTML from input/output/explanation, extract imageUrl
9. constraints: Array of {constraint: string} - keep constraint text clean

RULES - SOLUTIONS:
10. Generate bruteForce: Simple O(n²) or worse approach
11. Generate optimized: Most efficient O(n log n) or better approach
12. Generate bestPractice: Industry-standard clean code approach
13. Generate alternative: 1-2 additional creative approaches (optional, can be empty array)
14. Each solution MUST include ALL required fields: id (string), approach (string), language (string), code (string), complexity (REQUIRED object, cannot be null/undefined), explanation (string), stepByStep (array), difficulty (REQUIRED string: must be exactly "easy" or "medium" or "hard" - lowercase, no typos, no other values)
15. complexity object MUST be a complete object with: time (object with all 5 fields: notation, best, average, worst, explanation - ALL required), space (object with all 5 fields: notation, best, average, worst, explanation - ALL required), tradeoffs (optional string). complexity cannot be null, undefined, or missing any required nested fields.
16. stepByStep: Array (can be empty) of objects with stepNumber (number), title (string), description (string), codeSnippet (optional), visualization (optional), keyInsight (optional)
17. timeToSolve: Optional number (estimated minutes)
18. CRITICAL: difficulty field must be exactly the string "easy" or "medium" or "hard" - nothing else. Check spelling carefully.

RULES - EXPLANATIONS:
19. overview: High-level problem understanding (2-3 sentences)
20. approach: Main strategy/algorithm used (1-2 paragraphs)
21. stepByStep: 5-10 detailed steps with code snippets and visualizations
22. keyInsights: 3-5 important insights or patterns
23. commonMistakes: 3-5 common errors students make
24. relatedProblems: 2-3 similar problems with title, url, difficulty, similarity (0-1)
25. relatedProblems: use REAL platform URLs (same or another provider like leetcode, geeksforgeeks, etc.)

RULES - HINTS:
26. progressive: 3 hints from subtle to more direct (don't give solution away)
27. approach: General approach hint (1-2 sentences)
28. dataStructure: Suggested data structure if applicable
29. algorithm: Suggested algorithm/technique if applicable

RULES - METADATA:
30. metadata.formattedAt: ISO 8601 string (e.g., "2025-01-15T10:30:00Z")
31. metadata.aiModel: "gpt-4o-mini" (placeholder)
32. metadata.confidence: 0.95
33. metadata.processingTime: 0

OUTPUT FORMAT:
{"problem":{"description":{...},"examples":[...],"constraints":[...]},"solutions":{"bruteForce":{...},"optimized":{...},"bestPractice":{...},"alternative":[...]},"explanations":{"overview":"...","approach":"...","stepByStep":[...],"keyInsights":[...],"commonMistakes":[...],"relatedProblems":[...]},"hints":{"progressive":["...","...","..."],"approach":"...","dataStructure":"...","algorithm":"..."},"metadata":{"formattedAt":"2025-01-15T10:30:00Z","aiModel":"gpt-4o-mini","confidence":0.95,"processingTime":0}}

Return ONLY valid JSON, no markdown or extra text.`;