// Scrape Daily Question API (Public)
// Scrapes daily question from the specified provider
// Public route - no authentication required

import { NextRequest, NextResponse } from 'next/server';
import { publicRoute } from '@/lib/middleware/public-route.middleware';
import { ProviderFactory } from '@/lib/provider-service/provider-factory';
import { scrapeDailyQuestionSchema } from '@/lib/validation/scrape.schema';
import { ZodError } from 'zod';

const scrapeDailyQuestion = async (
	request: NextRequest,
	params?: { [key: string]: string }
): Promise<NextResponse> => {
	try {
		// Get providerType from route params
		if (!params || !params.providerType) {
			return NextResponse.json(
				{
					error: 'Missing providerType parameter',
					message: 'providerType route parameter is required',
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
					error: 'Validation failed',
					message: error.issues[0]?.message || 'Invalid providerType',
				},
				{ status: 400 }
			);
		}

		const { providerType } = validationResult.data;

		// Check if provider is supported
		if (!ProviderFactory.isSupported(providerType)) {
			return NextResponse.json(
				{
					error: 'Unsupported provider',
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
				},
				message: 'Daily question scraped successfully',
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
				error: 'Scraping failed',
				message:
					error instanceof Error
						? error.message
						: 'An unexpected error occurred while scraping',
			},
			{ status: 500 }
		);
	}
};

export const GET = publicRoute(scrapeDailyQuestion);

