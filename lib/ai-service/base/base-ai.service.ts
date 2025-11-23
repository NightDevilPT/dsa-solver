// Base AI Service
// Abstract base class for all AI provider implementations

import { z } from "zod";
import type { Problem } from "@/interface/provider.interface";
import type {
	FormattedProblem,
	ProblemSolutions,
	ProblemExplanations,
	ProblemHints,
} from "@/interface/problem.interface";
import type {
	AIFormatOptions,
	AIFormatResponse,
} from "@/interface/ai.interface";

/**
 * Abstract base class for AI services
 * All AI provider implementations must extend this class
 */
export abstract class BaseAIService {
	/**
	 * Initialize AI client
	 * Must be implemented by each provider
	 */
	protected abstract initializeClient(): Promise<void>;

	/**
	 * Get client configuration (endpoint, model, etc.)
	 * Must be implemented by each provider
	 */
	protected abstract getClientConfig(): {
		baseURL?: string;
		apiKey: string;
		model: string;
		defaultHeaders?: Record<string, string>;
	};

	/**
	 * Format problem description, examples, constraints
	 * Must be implemented by each provider
	 */
	abstract formatProblem(
		rawProblem: Problem,
		options?: AIFormatOptions
	): Promise<AIFormatResponse>;

	/**
	 * Generate solutions
	 * Must be implemented by each provider
	 */
	abstract generateSolutions(
		problem: FormattedProblem,
		languages: string[]
	): Promise<ProblemSolutions>;

	/**
	 * Generate explanations
	 * Must be implemented by each provider
	 */
	abstract generateExplanations(
		problem: FormattedProblem,
		solutions: ProblemSolutions,
		depth: "basic" | "intermediate" | "advanced"
	): Promise<ProblemExplanations>;

	/**
	 * Generate hints
	 * Must be implemented by each provider
	 */
	abstract generateHints(
		problem: FormattedProblem,
		count: number
	): Promise<ProblemHints>;

	/**
	 * Build prompt from template with data replacement
	 * @param template - Prompt template string
	 * @param data - Data object to replace placeholders
	 * @returns Formatted prompt string
	 */
	protected buildPrompt(template: string, data: any): string {
		let prompt = template;

		// Replace common placeholders
		if (data.title) {
			prompt = prompt.replace(/\{\{title\}\}/g, data.title);
		}
		if (data.description) {
			prompt = prompt.replace(/\{\{description\}\}/g, data.description);
		}
		if (data.examples) {
			prompt = prompt.replace(
				/\{\{examples\}\}/g,
				JSON.stringify(data.examples, null, 2)
			);
		}
		if (data.constraints) {
			prompt = prompt.replace(
				/\{\{constraints\}\}/g,
				JSON.stringify(data.constraints, null, 2)
			);
		}

		// Add input data as JSON context at the end
		prompt += `\n\nInput Data:\n${JSON.stringify(data, null, 2)}`;

		return prompt;
	}

	/**
	 * Parse and validate JSON response with Zod schema
	 * @param content - JSON string from AI response
	 * @param schema - Zod schema for validation
	 * @returns Validated and parsed data
	 */
	protected parseAndValidate<T>(
		content: string,
		schema: z.ZodSchema<T>
	): T {
		try {
			const jsonData = JSON.parse(content);
			return schema.parse(jsonData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				throw new Error(
					`Validation failed: ${error.issues.map((issue) => issue.message).join(", ")}`
				);
			}
			if (error instanceof SyntaxError) {
				throw new Error(`Invalid JSON response: ${error.message}`);
			}
			throw new Error(`Failed to parse response: ${error}`);
		}
	}

	/**
	 * Retry request with exponential backoff
	 * @param fn - Function to retry
	 * @param maxRetries - Maximum number of retries (default: 3)
	 * @param delay - Initial delay in ms (default: 1000)
	 * @returns Result from function
	 */
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

	/**
	 * Delay helper for retry logic
	 * @param ms - Milliseconds to delay
	 */
	protected delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Handle errors with context
	 * @param error - Error object
	 * @param context - Context string for error message
	 */
	protected handleError(error: any, context: string): never {
		const message = error?.message || "Unknown error";
		throw new Error(`AI Service Error (${context}): ${message}`);
	}
}

