// Problem Data Structure Interfaces
// Defines types for formatted problem data, solutions, explanations, and hints

import { ProviderType } from "@/lib/generated/prisma/enums";
import type {
	ProblemExample,
	ProblemConstraint,
} from "./provider.interface";

/**
 * Problem Description Structure
 * AI formats description into structured sections for easy UI rendering
 */
export interface ProblemDescription {
	// Raw and formatted versions
	raw: string; // Original scraped text
	formatted: string; // AI-cleaned and formatted

	// Structured sections (for UI components)
	sections: DescriptionSection[];

	// Metadata
	wordCount: number;
	readingTime: number; // Estimated reading time in minutes
	hasMath: boolean; // Contains mathematical notation
	hasCode: boolean; // Contains code snippets
}

/**
 * Description Section (for rendering different parts)
 */
export interface DescriptionSection {
	type: "paragraph" | "list" | "code" | "math" | "image" | "table";
	content: string;
	order: number;
	metadata?: {
		language?: string; // For code blocks
		caption?: string; // For images/tables
		level?: number; // For nested lists
	};
}

/**
 * Problem Solutions Structure
 * Multiple solution approaches with UI-friendly format
 */
export interface ProblemSolutions {
	bruteForce?: Solution;
	optimized?: Solution;
	alternative?: Solution[]; // Additional approaches
	bestPractice?: Solution; // Industry best practice
}

/**
 * Solution Structure (ready for code editor UI)
 */
export interface Solution {
	id: string;
	approach: string; // Algorithm/approach name
	language: string; // Programming language
	code: string; // Complete solution code
	complexity: ComplexityAnalysis;
	explanation: string; // High-level explanation
	stepByStep: SolutionStep[]; // For step-by-step UI
	timeToSolve?: number; // Estimated solving time (minutes)
	difficulty: "easy" | "medium" | "hard";
}

/**
 * Solution Step (for step-by-step UI component)
 */
export interface SolutionStep {
	stepNumber: number;
	title: string;
	description: string;
	codeSnippet?: string; // Relevant code for this step
	visualization?: string; // Visual representation (ASCII art, diagram description)
	keyInsight?: string; // Important insight at this step
}

/**
 * Complexity Analysis (for UI display)
 */
export interface ComplexityAnalysis {
	time: {
		notation: string; // "O(n log n)"
		best: string;
		average: string;
		worst: string;
		explanation: string;
	};
	space: {
		notation: string; // "O(1)"
		best: string;
		average: string;
		worst: string;
		explanation: string;
	};
	tradeoffs?: string; // Time vs space tradeoffs
}

/**
 * Problem Explanations Structure
 */
export interface ProblemExplanations {
	overview: string;
	approach: string;
	stepByStep: ExplanationStep[];
	keyInsights: string[];
	commonMistakes: string[];
	relatedProblems?: RelatedProblem[];
}

/**
 * Explanation Step
 */
export interface ExplanationStep {
	step: number;
	title: string;
	description: string;
	codeSnippet?: string;
	visualization?: string;
}

/**
 * Related Problem
 */
export interface RelatedProblem {
	title: string;
	url: string;
	difficulty: string;
	similarity: number; // 0-1, how similar the problems are
}

/**
 * Problem Hints Structure
 */
export interface ProblemHints {
	progressive: string[]; // Level 1, 2, 3 hints
	approach: string;
	dataStructure?: string; // Suggested data structure
	algorithm?: string; // Suggested algorithm
}

/**
 * Complete Formatted Problem Data Structure
 * This is what AI formats and what we store in database
 */
export interface FormattedProblem {
	// Basic Info (from scraping)
	id: string;
	slug: string;
	problemUrl: string;
	title: string;
	difficulty: string;
	topics: string[];
	provider: ProviderType;
	problemDate: Date;
	isPremium: boolean;

	// Content (AI-formatted)
	description: ProblemDescription;
	examples: ProblemExample[];
	constraints: ProblemConstraint[];

	// AI-Generated Solutions
	solutions?: ProblemSolutions;

	// AI-Generated Explanations
	explanations?: ProblemExplanations;

	// AI-Generated Hints
	hints?: ProblemHints;
}

// Re-export ProblemExample and ProblemConstraint from provider.interface.ts
export type { ProblemExample, ProblemConstraint };

