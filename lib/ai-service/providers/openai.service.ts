// OpenAI-Compatible Service Implementation
// Handles AI operations using OpenAI-compatible APIs (OpenAI, Groq, OpenRouter, etc.)

import OpenAI from "openai";
import { PROBLEM_FORMAT_PROMPT } from "../base/prompts/problem-format.prompt";
import { AIProblemResponseSchema } from "../base/schemas/ai-response.schema";
import { BaseAIService } from "../base/base-ai.service";
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

export class OpenAIService extends BaseAIService {
	private client: OpenAI | null = null;

	/**
	 * Initialize OpenAI-compatible client
	 * Supports OpenAI, Groq, OpenRouter via baseURL configuration
	 */
	protected async initializeClient(): Promise<void> {
		const config = this.getClientConfig();
		this.client = new OpenAI({
			apiKey: config.apiKey,
			baseURL: config.baseURL, // Custom baseURL for Groq, OpenRouter, etc.
			defaultHeaders: config.defaultHeaders,
		});
	}

	/**
	 * Get client configuration
	 * Supports multiple providers via environment variables
	 */
	protected getClientConfig() {
		// Check for provider-specific API keys (priority order)
		const geminiApiKey = process.env.GEMINI_API_KEY;
		const groqApiKey = process.env.GROQ_API_KEY;
		const openRouterApiKey = process.env.OPENROUTER_API_KEY;
		const openaiApiKey = process.env.OPENAI_API_KEY;

		let apiKey: string;
		let baseURL: string | undefined;
		let defaultModel: string;
		let defaultHeaders: Record<string, string> | undefined;

		if (geminiApiKey) {
			// Gemini configuration (Google AI)
			apiKey = geminiApiKey;
			baseURL =
				process.env.GEMINI_BASE_URL ||
				"https://generativelanguage.googleapis.com/v1beta/openai/";
			defaultModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
		} else if (groqApiKey) {
			// Groq configuration
			apiKey = groqApiKey;
			baseURL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
			defaultModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
		} else if (openRouterApiKey) {
			// OpenRouter configuration
			apiKey = openRouterApiKey;
			baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
			defaultModel = process.env.OPENROUTER_MODEL || "gemini-2.0-flash";
			defaultHeaders = {
				"HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER || "",
				"X-Title": process.env.OPENROUTER_X_TITLE || "DSA Solver",
			};
		} else if (openaiApiKey) {
			// OpenAI configuration (default)
			apiKey = openaiApiKey;
			baseURL = process.env.OPENAI_BASE_URL; // Optional, defaults to OpenAI's URL
			defaultModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
		} else {
			throw new Error(
				"No AI API key found. Please set one of: GEMINI_API_KEY, OPENAI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY in your .env file."
			);
		}

		// Allow override via generic env vars
		const model = process.env.AI_MODEL || defaultModel;
		const customBaseURL = process.env.AI_BASE_URL || baseURL;

		return {
			apiKey,
			baseURL: customBaseURL,
			model,
			defaultHeaders,
		};
	}

	/**
	 * Format problem using OpenAI
	 */
	async formatProblem(
		rawProblem: Problem,
		options?: AIFormatOptions
	): Promise<AIFormatResponse> {
		try {
			// Initialize client if not already initialized
			if (!this.client) {
				await this.initializeClient();
			}

			const config = this.getClientConfig();
			const prompt = this.buildPrompt(PROBLEM_FORMAT_PROMPT, rawProblem);

			const startTime = Date.now();

			// Make API call with retry logic
			const response = await this.retryRequest(async () => {
				return await this.client!.chat.completions.create({
					model: config.model,
					messages: [{ role: "user", content: prompt }],
					response_format: { type: "json_object" },
					temperature: 0.3,
				});
			});

			const processingTime = Date.now() - startTime;

			const content = response.choices[0]?.message?.content;
			if (!content) {
				throw new Error("No response content from AI");
			}

			// Extract token usage from response
			const tokensUsed =
				response.usage?.total_tokens ||
				(response.usage?.prompt_tokens ?? 0) +
					(response.usage?.completion_tokens ?? 0) ||
				0;

			// Parse and validate response
			const validated = this.parseAndValidate(
				content,
				AIProblemResponseSchema
			);

			// Transform null to undefined for optional fields to match interface
			const transformedData: import("@/interface/ai.interface").AIProblemResponse = {
				...validated,
				problem: {
					...validated.problem,
					examples: validated.problem.examples.map((example) => ({
						...example,
						explanation: example.explanation ?? undefined,
						imageUrl: example.imageUrl ?? undefined,
					})),
				},
				metadata: {
					...validated.metadata,
					formattedAt: new Date(validated.metadata.formattedAt),
					processingTime,
					aiModel: config.model,
				},
			};

			return {
				success: true,
				data: transformedData,
				processingTime,
				tokensUsed,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				processingTime: 0,
				tokensUsed: 0,
			};
		}
	}

	/**
	 * Generate solutions (not implemented yet)
	 */
	async generateSolutions(
		problem: FormattedProblem,
		languages: string[]
	): Promise<ProblemSolutions> {
		throw new Error("Not implemented yet");
	}

	/**
	 * Generate explanations (not implemented yet)
	 */
	async generateExplanations(
		problem: FormattedProblem,
		solutions: ProblemSolutions,
		depth: "basic" | "intermediate" | "advanced"
	): Promise<ProblemExplanations> {
		throw new Error("Not implemented yet");
	}

	/**
	 * Generate hints (not implemented yet)
	 */
	async generateHints(
		problem: FormattedProblem,
		count: number
	): Promise<ProblemHints> {
		throw new Error("Not implemented yet");
	}
}

