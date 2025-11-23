// Zod Schemas for AI Response Validation
// Validates AI responses against expected interfaces

import { z } from "zod";

/**
 * Description Section Schema
 */
const DescriptionSectionSchema = z.object({
	type: z.enum(["paragraph", "list", "code", "math", "image", "table"]),
	content: z.string(),
	order: z.number(),
	metadata: z
		.object({
			language: z.string().optional(),
			caption: z.string().optional(),
			level: z.number().optional(),
		})
		.optional(),
});

/**
 * Problem Description Schema
 */
const ProblemDescriptionSchema = z.object({
	raw: z.string(),
	formatted: z.string(),
	sections: z.array(DescriptionSectionSchema),
	wordCount: z.number(),
	readingTime: z.number(),
	hasMath: z.boolean(),
	hasCode: z.boolean(),
});

/**
 * Problem Example Schema
 */
const ProblemExampleSchema = z.object({
	exampleNumber: z.number(),
	input: z.string(),
	output: z.string(),
	explanation: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
});

/**
 * Problem Constraint Schema
 */
const ProblemConstraintSchema = z.object({
	constraint: z.string(),
});

/**
 * Metadata Schema
 */
const MetadataSchema = z.object({
	formattedAt: z.string().datetime(),
	aiModel: z.string(),
	confidence: z.number().min(0).max(1),
	processingTime: z.number(),
});

/**
 * Solution Step Schema
 */
const SolutionStepSchema = z.object({
	stepNumber: z.number(),
	title: z.string(),
	description: z.string(),
	codeSnippet: z.string().optional(),
	visualization: z.string().optional(),
	keyInsight: z.string().optional(),
});

/**
 * Complexity Analysis Schema
 */
const ComplexityAnalysisSchema = z.object({
	time: z.object({
		notation: z.string(),
		best: z.string(),
		average: z.string(),
		worst: z.string(),
		explanation: z.string(),
	}),
	space: z.object({
		notation: z.string(),
		best: z.string(),
		average: z.string(),
		worst: z.string(),
		explanation: z.string(),
	}),
	tradeoffs: z.string().optional(),
});

/**
 * Solution Schema
 */
const SolutionSchema = z.object({
	id: z.string(),
	approach: z.string(),
	language: z.string(),
	code: z.string(),
	complexity: ComplexityAnalysisSchema,
	explanation: z.string(),
	stepByStep: z.array(SolutionStepSchema),
	timeToSolve: z.number().optional(),
	difficulty: z.enum(["easy", "medium", "hard"]),
});

/**
 * Problem Solutions Schema
 */
const ProblemSolutionsSchema = z.object({
	bruteForce: SolutionSchema.optional(),
	optimized: SolutionSchema.optional(),
	alternative: z.array(SolutionSchema).optional(),
	bestPractice: SolutionSchema.optional(),
});

/**
 * Explanation Step Schema
 */
const ExplanationStepSchema = z.object({
	step: z.number(),
	title: z.string(),
	description: z.string(),
	codeSnippet: z.string().optional(),
	visualization: z.string().optional(),
});

/**
 * Related Problem Schema
 */
const RelatedProblemSchema = z.object({
	title: z.string(),
	url: z.string(),
	difficulty: z.string(),
	similarity: z.number().min(0).max(1),
});

/**
 * Problem Explanations Schema
 */
const ProblemExplanationsSchema = z.object({
	overview: z.string(),
	approach: z.string(),
	stepByStep: z.array(ExplanationStepSchema),
	keyInsights: z.array(z.string()),
	commonMistakes: z.array(z.string()),
	relatedProblems: z.array(RelatedProblemSchema).optional(),
});

/**
 * Problem Hints Schema
 */
const ProblemHintsSchema = z.object({
	progressive: z.array(z.string()),
	approach: z.string(),
	dataStructure: z.string().optional(),
	algorithm: z.string().optional(),
});

/**
 * AI Problem Response Schema
 * Validates the complete AI response structure
 */
export const AIProblemResponseSchema = z.object({
	problem: z.object({
		description: ProblemDescriptionSchema,
		examples: z.array(ProblemExampleSchema),
		constraints: z.array(ProblemConstraintSchema),
	}),
	solutions: ProblemSolutionsSchema.optional(),
	explanations: ProblemExplanationsSchema.optional(),
	hints: ProblemHintsSchema.optional(),
	metadata: MetadataSchema,
});

/**
 * Type export for TypeScript
 */
export type AIProblemResponseType = z.infer<typeof AIProblemResponseSchema>;

