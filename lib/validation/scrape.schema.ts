// Scrape Validation Schemas
// Zod schemas for scraping-related API requests

import { z } from 'zod';
import { ProviderType } from '@/lib/generated/prisma/enums';

/**
 * Scrape daily question request schema
 * Validates providerType parameter for scraping daily questions
 */
export const scrapeDailyQuestionSchema = z.object({
	providerType: z.nativeEnum(ProviderType, {
		message: 'Invalid provider type. Must be LEETCODE or GFG',
	}),
});

