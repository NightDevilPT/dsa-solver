// Scrape Daily Question API (Public)
// Scrapes daily question from the specified provider
// Formats with AI and saves to database
// Public route - no authentication required

import prisma from "@/lib/prisma-client";
import { ZodError } from "zod";
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

		// Check if today's problem already exists in database
		const today = new Date().toLocaleDateString();

		const existingProblem = await prisma.problem.findFirst({
			where: {
				provider: providerType,
			},
			orderBy: {
				formattedAt: "desc", // Get the latest formatted record
			},
		});

		// If problem exists for today, return it directly
		if (existingProblem) {
			console.log("=== Using Cached Problem from Database ===");
			console.log("Problem ID:", existingProblem.id);
			console.log("Provider:", existingProblem.provider);
			console.log("Title:", existingProblem.title);
			console.log("Problem Date:", existingProblem.problemDate);
			console.log("AI Model:", existingProblem.aiModel || "N/A");
			console.log("Tokens Used:", existingProblem.tokensUsed || "N/A");
			console.log("Formatted At:", existingProblem.formattedAt);
			console.log("=========================================");

			const problemDate = existingProblem.formattedAt 
				? new Date(existingProblem.formattedAt).toLocaleDateString()
				: null;
			console.log("Problem Date Matching:", problemDate, today);

			if (problemDate === today) {
				return NextResponse.json({
					data: {
						id: existingProblem.problemId,
						slug: existingProblem.problemSlug,
						problemUrl: existingProblem.problemUrl,
						title: existingProblem.title,
						difficulty: existingProblem.difficulty,
						topics: existingProblem.topics,
						description: existingProblem.description,
						examples: existingProblem.examples,
						constraints: existingProblem.constraints,
						isPremium: existingProblem.isPremium,
						provider: existingProblem.provider,
						problemDate: existingProblem.problemDate.toISOString(),
						aiFormatted: true,
						databaseId: existingProblem.id,
						solutions: existingProblem.solutions,
						explanations: existingProblem.explanations,
						hints: existingProblem.hints,
						tokensUsed: existingProblem.tokensUsed,
						aiModel: existingProblem.aiModel,
						aiConfidence: existingProblem.aiConfidence,
						cached: true, // Indicate this is from cache
					},
					message:
						"Daily question retrieved from database (already processed today)",
				});
			}
		}

		console.log("=== No Cached Problem Found - Starting Scrape ===");
		console.log("Provider:", providerType);
		console.log("Date:", today);
		console.log("==================================================");

		// Create provider service instance
		const providerService = ProviderFactory.create(providerType);

		try {
			// Scrape daily question
			const problem = await providerService.scrapeDailyQuestion();

			// Close browser after scraping
			await providerService.closeBrowser();

			if(!problem){
				return NextResponse.json(
					{
						error: "No problem found",
						message: "No problem found for today",
					},
					{ status: 404 }
				);
			}

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
					problemDate: problem.problemDate.toISOString()
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
