// Scrape Daily Question API (Public)
// Scrapes daily question from the specified provider
// Formats with AI and saves to database
// Public route - no authentication required

import prisma from "@/lib/prisma-client";
import { ZodError } from "zod";
import { AIService } from "@/lib/ai-service/ai.service";
import { NextRequest, NextResponse } from "next/server";
import { QuestionType } from "@/lib/generated/prisma/enums";
import { publicRoute } from "@/lib/middleware/public-route.middleware";
import { ProviderFactory } from "@/lib/provider-service/provider-factory";
import { scrapeDailyQuestionSchema } from "@/lib/validation/scrape.schema";

const scrapeDailyQuestion = async (
	request: NextRequest,
	params?: { [key: string]: string }
): Promise<NextResponse> => {
	try {
		// Get providerType from route params
		if (!params || !params.providerType) {
			return NextResponse.json(
				{
					error: "Missing providerType parameter",
					message: "providerType route parameter is required",
				},
				{ status: 400 }
			);
		}

		const providerTypeParam = params.providerType;

		// Validate providerType
		const validationResult = scrapeDailyQuestionSchema.safeParse({
			providerType: providerTypeParam,
		});

		if (!validationResult.success) {
			const error = validationResult.error as ZodError;
			return NextResponse.json(
				{
					error: "Validation failed",
					message: error.issues[0]?.message || "Invalid providerType",
				},
				{ status: 400 }
			);
		}

		const { providerType } = validationResult.data;

		// Check if provider is supported
		if (!ProviderFactory.isSupported(providerType)) {
			return NextResponse.json(
				{
					error: "Unsupported provider",
					message: `Provider ${providerType} is not supported`,
				},
				{ status: 400 }
			);
		}

		// Create provider service instance
		const providerService = ProviderFactory.create(providerType);

		try {
			// Scrape daily question
			const problem = await providerService.scrapeDailyQuestion();

			// Close browser after scraping
			await providerService.closeBrowser();

			// Format problem with AI (Gemini)
			const aiService = new AIService();
			const aiResponse = await aiService.formatProblem(problem);

			// Console log AI response
			console.log("=== AI Formatting Response ===");
			console.log(JSON.stringify(aiResponse, null, 2));
			console.log("Tokens Used:", aiResponse.tokensUsed || "N/A");
			console.log("==============================");

			// Prepare data for database
			const problemDate = new Date(problem.problemDate);
			problemDate.setUTCHours(0, 0, 0, 0); // Set to start of day UTC

			// Prepare JSON data for database (cast to any for Prisma JSON fields)
			const descriptionJson =
				aiResponse.success && aiResponse.data
					? (aiResponse.data.problem.description as any)
					: null;
			const examplesJson =
				aiResponse.success && aiResponse.data
					? (aiResponse.data.problem.examples as any)
					: null;
			const constraintsJson =
				aiResponse.success && aiResponse.data
					? (aiResponse.data.problem.constraints as any)
					: null;
			const solutionsJson =
				aiResponse.success &&
				aiResponse.data &&
				aiResponse.data.solutions
					? (aiResponse.data.solutions as any)
					: null;
			const explanationsJson =
				aiResponse.success &&
				aiResponse.data &&
				aiResponse.data.explanations
					? (aiResponse.data.explanations as any)
					: null;
			const hintsJson =
				aiResponse.success && aiResponse.data && aiResponse.data.hints
					? (aiResponse.data.hints as any)
					: null;

			// Save to database using upsert (create or update)
			const savedProblem = await prisma.problem.upsert({
				where: {
					provider_questionType_problemDate: {
						provider: problem.provider,
						questionType: QuestionType.PROBLEM_OF_THE_DAY,
						problemDate: problemDate,
					},
				},
				create: {
					provider: problem.provider,
					questionType: QuestionType.PROBLEM_OF_THE_DAY,
					problemId: problem.id,
					problemSlug: problem.slug,
					problemUrl: problem.problemUrl,
					title: problem.title,
					difficulty: problem.difficulty,
					topics: problem.topics,
					description: descriptionJson,
					examples: examplesJson,
					constraints: constraintsJson,
					solutions: solutionsJson,
					explanations: explanationsJson,
					hints: hintsJson,
					isPremium: problem.isPremium || false,
					problemDate: problemDate,
					formattedAt: aiResponse.success ? new Date() : null,
					aiModel:
						aiResponse.success && aiResponse.data
							? aiResponse.data.metadata.aiModel
							: null,
					aiConfidence:
						aiResponse.success && aiResponse.data
							? aiResponse.data.metadata.confidence
							: null,
					tokensUsed:
						aiResponse.success && aiResponse.tokensUsed
							? aiResponse.tokensUsed
							: null,
				},
				update: {
					problemId: problem.id,
					problemSlug: problem.slug,
					problemUrl: problem.problemUrl,
					title: problem.title,
					difficulty: problem.difficulty,
					topics: problem.topics,
					description: descriptionJson ?? undefined,
					examples: examplesJson ?? undefined,
					constraints: constraintsJson ?? undefined,
					solutions: solutionsJson ?? undefined,
					explanations: explanationsJson ?? undefined,
					hints: hintsJson ?? undefined,
					isPremium: problem.isPremium || false,
					formattedAt: aiResponse.success ? new Date() : undefined,
					aiModel:
						aiResponse.success && aiResponse.data
							? aiResponse.data.metadata.aiModel
							: undefined,
					aiConfidence:
						aiResponse.success && aiResponse.data
							? aiResponse.data.metadata.confidence
							: undefined,
					tokensUsed:
						aiResponse.success && aiResponse.tokensUsed
							? aiResponse.tokensUsed
							: undefined,
				},
			});

			console.log("=== Problem Saved to Database ===");
			console.log("Problem ID:", savedProblem.id);
			console.log("Provider:", savedProblem.provider);
			console.log("Title:", savedProblem.title);
			console.log("Formatted:", savedProblem.formattedAt ? "Yes" : "No");
			console.log("AI Model:", savedProblem.aiModel || "N/A");
			console.log("Tokens Used:", savedProblem.tokensUsed || "N/A");
			console.log("==================================");

			// Return problem data in common JSON format
			return NextResponse.json({
				data: {
					id: problem.id,
					slug: problem.slug,
					problemUrl: problem.problemUrl,
					title: problem.title,
					difficulty: problem.difficulty,
					topics: problem.topics,
					description: problem.description,
					examples: problem.examples,
					constraints: problem.constraints,
					isPremium: problem.isPremium || false,
					provider: problem.provider,
					problemDate: problem.problemDate.toISOString(),
					aiFormatted: aiResponse.success,
					databaseId: savedProblem.id,
					solutions: savedProblem.solutions,
					explanations: savedProblem.explanations,
					hints: savedProblem.hints,
					tokensUsed: savedProblem.tokensUsed || null,
					aiModel: savedProblem.aiModel || null,
					aiConfidence: savedProblem.aiConfidence || null,
				},
				message:
					"Daily question scraped, formatted, and saved successfully",
			});
		} catch (scrapeError) {
			// Ensure browser is closed even on error
			try {
				await providerService.closeBrowser();
			} catch (closeError) {
				// Ignore close errors
			}

			throw scrapeError;
		}
	} catch (error) {
		return NextResponse.json(
			{
				error: "Scraping failed",
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred while scraping",
			},
			{ status: 500 }
		);
	}
};

export const GET = publicRoute(scrapeDailyQuestion);
