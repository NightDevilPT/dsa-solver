// AI Response Format Interfaces
// Structured format that AI returns, ready for storage and UI rendering

import { ProblemDescription, ProblemExample, ProblemConstraint } from "./problem.interface";

/**
 * AI Response Format
 * Structured format that AI returns, ready for storage and UI rendering
 */
export interface AIProblemResponse {
	// Formatted Problem Data
	problem: {
		description: ProblemDescription;
		examples: ProblemExample[];
		constraints: ProblemConstraint[];
	};

	// Solutions (if requested)
	solutions?: {
		bruteForce?: AISolutionResponse;
		optimized?: AISolutionResponse;
		alternative?: AISolutionResponse[];
		bestPractice?: AISolutionResponse;
	};

	// Explanations (if requested)
	explanations?: {
		overview: string;
		approach: string;
		stepByStep: AIExplanationStep[];
		keyInsights: string[];
		commonMistakes: string[];
		relatedProblems?: Array<{
			title: string;
			url: string;
			difficulty: string;
			similarity: number;
		}>;
	};

	// Hints (if requested)
	hints?: {
		progressive: string[]; // Level 1, 2, 3 hints
		approach: string;
		dataStructure?: string; // Suggested data structure
		algorithm?: string; // Suggested algorithm
	};

	// Metadata
	metadata: {
		formattedAt: Date;
		aiModel: string;
		confidence: number; // 0-1, AI confidence in formatting
		processingTime: number; // ms
	};
}

/**
 * AI Solution Response (structured for storage)
 * Matches Solution interface from problem.interface.ts
 */
export interface AISolutionResponse {
	id: string;
	approach: string;
	language: string;
	code: string;
	complexity: {
		time: {
			notation: string;
			best: string;
			average: string;
			worst: string;
			explanation: string;
		};
		space: {
			notation: string;
			best: string;
			average: string;
			worst: string;
			explanation: string;
		};
		tradeoffs?: string;
	};
	explanation: string;
	stepByStep: Array<{
		stepNumber: number;
		title: string;
		description: string;
		codeSnippet?: string;
		visualization?: string;
		keyInsight?: string;
	}>;
	timeToSolve?: number;
	difficulty: "easy" | "medium" | "hard";
}

/**
 * AI Explanation Step
 */
export interface AIExplanationStep {
	step: number;
	title: string;
	description: string;
	codeSnippet?: string;
	visualization?: string;
}

/**
 * AI Service Request Options
 */
export interface AIFormatOptions {
	includeSolutions?: boolean;
	includeExplanations?: boolean;
	includeHints?: boolean;
	solutionLanguages?: string[]; // Preferred languages for solutions
	explanationDepth?: "basic" | "intermediate" | "advanced";
	hintCount?: number; // Number of progressive hints to generate
}

/**
 * AI Service Response
 */
export interface AIFormatResponse {
	success: boolean;
	data?: AIProblemResponse;
	error?: string;
	processingTime: number;
	tokensUsed?: number; // Number of tokens used for the request
}

