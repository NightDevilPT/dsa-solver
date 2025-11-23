// Main AI Service
// Unified interface for all AI operations

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
import { OpenAIService } from "./providers/openai.service";
import type { Problem } from "@/interface/provider.interface";

/**
 * Main AI Service
 * Provides unified interface for all AI operations
 * Supports OpenAI, Groq, OpenRouter via environment variables
 */
export class AIService {
	private service: OpenAIService;

	/**
	 * Initialize AI service
	 * Configuration is handled via environment variables:
	 * - GROQ_API_KEY for Groq
	 * - OPENROUTER_API_KEY for OpenRouter
	 * - OPENAI_API_KEY for OpenAI (default)
	 */
	constructor() {
		this.service = new OpenAIService();
	}

	/**
	 * Format problem with AI
	 * @param rawProblem - Raw problem data from scraping
	 * @param options - Formatting options
	 * @returns Formatted problem response
	 */
	async formatProblem(
		rawProblem: Problem,
		options?: AIFormatOptions
	): Promise<AIFormatResponse> {
		return this.service.formatProblem(rawProblem, options);
	}

	/**
	 * Generate solutions for a problem
	 * @param problem - Formatted problem
	 * @param languages - Programming languages to generate solutions in
	 * @returns Problem solutions
	 */
	async generateSolutions(
		problem: FormattedProblem,
		languages: string[]
	): Promise<ProblemSolutions> {
		return this.service.generateSolutions(problem, languages);
	}

	/**
	 * Generate explanations for a problem
	 * @param problem - Formatted problem
	 * @param solutions - Problem solutions
	 * @param depth - Explanation depth level
	 * @returns Problem explanations
	 */
	async generateExplanations(
		problem: FormattedProblem,
		solutions: ProblemSolutions,
		depth: "basic" | "intermediate" | "advanced"
	): Promise<ProblemExplanations> {
		return this.service.generateExplanations(problem, solutions, depth);
	}

	/**
	 * Generate hints for a problem
	 * @param problem - Formatted problem
	 * @param count - Number of hints to generate
	 * @returns Problem hints
	 */
	async generateHints(
		problem: FormattedProblem,
		count: number
	): Promise<ProblemHints> {
		return this.service.generateHints(problem, count);
	}
}

