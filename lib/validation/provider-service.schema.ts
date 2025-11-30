// Provider Service Validation Schemas
// Zod schemas for provider service-related API requests

import { z } from "zod";
import { ProviderType } from "@/lib/generated/prisma/enums";

// ============================================
// Helper Functions
// ============================================

/**
 * Validates time format (HH:mm)
 * @param time - Time string in HH:mm format
 * @returns true if valid, false otherwise
 */
const isValidTimeFormat = (time: string): boolean => {
	const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
	return timeRegex.test(time);
};

/**
 * Custom time format validator
 */
const timeFormatSchema = z
	.string()
	.refine(
		(time) => isValidTimeFormat(time),
		{
			message: "Time must be in HH:mm format (e.g., '09:00')",
		}
	)
	.nullable();

// ============================================
// Route Parameters Validation
// ============================================

/**
 * Provider service route parameters schema
 * Validates providerType and serviceId from route params
 */
export const providerServiceParamsSchema = z.object({
	providerType: z
		.string()
		.transform((val) => val.toUpperCase())
		.pipe(
			z.nativeEnum(ProviderType, {
				message: `Provider type must be one of: ${Object.values(ProviderType).join(", ")}`,
			})
		),
	id: z.string().min(1, "Service ID is required"),
});

/**
 * Type for provider service route parameters
 */
export type ProviderServiceParams = z.infer<typeof providerServiceParamsSchema>;

// ============================================
// Service Config Validation
// ============================================

/**
 * Update service config request schema
 * Validates serviceConfig and isEnabled fields
 */
export const updateServiceConfigSchema = z
	.object({
		serviceConfig: z
			.record(z.string(), z.any())
			.optional()
			.describe("Service-specific configuration object"),
		isEnabled: z
			.boolean()
			.optional()
			.describe("Whether the service is enabled for the user"),
	})
	.strict();

/**
 * Type for update service config request
 */
export type UpdateServiceConfigRequest = z.infer<
	typeof updateServiceConfigSchema
>;

// ============================================
// Notification Config Validation
// ============================================

/**
 * Email frequency enum
 */
export const EmailFrequencyEnum = z.enum(["DAILY", "WEEKLY", "INSTANT"], {
	message: "Email frequency must be one of: DAILY, WEEKLY, INSTANT",
});

/**
 * Base notification config schema (without conditional validations)
 */
const baseNotificationConfigSchema = z.object({
	enabled: z.boolean().optional().describe("Whether notifications are enabled"),
	mailSubject: z
		.string()
		.nullable()
		.optional()
		.describe(
			"Email subject line (supports variables like {problemTitle}, {numberOfQuestions})"
		),
	emailFrequency: EmailFrequencyEnum.optional().describe(
		"Frequency of email notifications"
	),
	preferredTime: timeFormatSchema
		.optional()
		.describe("Preferred time for notifications (HH:mm format)"),
	includeBruteForce: z
		.boolean()
		.optional()
		.describe("Include brute force solutions in emails"),
	includeOptimized: z
		.boolean()
		.optional()
		.describe("Include optimized solutions in emails"),
	includeBestPractice: z
		.boolean()
		.optional()
		.describe("Include best practice solutions in emails"),
	includeAlternative: z
		.boolean()
		.optional()
		.describe("Include alternative solutions in emails"),
	includeExplanationOverview: z
		.boolean()
		.optional()
		.describe("Include explanation overview in emails"),
	includeExplanationApproach: z
		.boolean()
		.optional()
		.describe("Include explanation approach in emails"),
	includeStepByStep: z
		.boolean()
		.optional()
		.describe("Include step-by-step explanations in emails"),
	includeKeyInsights: z
		.boolean()
		.optional()
		.describe("Include key insights in emails"),
	includeCommonMistakes: z
		.boolean()
		.optional()
		.describe("Include common mistakes in emails"),
	includeRelatedProblems: z
		.boolean()
		.optional()
		.describe("Include related problems in emails"),
	includeHintsProgressive: z
		.boolean()
		.optional()
		.describe("Include progressive hints in emails"),
	includeHintsApproach: z
		.boolean()
		.optional()
		.describe("Include hints approach in emails"),
	includeHintsDataStructure: z
		.boolean()
		.optional()
		.describe("Include data structure hints in emails"),
	includeHintsAlgorithm: z
		.boolean()
		.optional()
		.describe("Include algorithm hints in emails"),
	autoSubmit: z
		.boolean()
		.optional()
		.describe("Enable automatic problem submission"),
	autoSubmitTime: timeFormatSchema
		.optional()
		.describe("Time for automatic submission (HH:mm format)"),
	autoSubmitOnlyIfSolved: z
		.boolean()
		.optional()
		.describe("Only submit if problem is solved"),
	autoSubmitSendConfirmation: z
		.boolean()
		.optional()
		.describe("Send confirmation email after submission"),
	autoSubmitConfirmationSubject: z
		.string()
		.nullable()
		.optional()
		.describe(
			"Subject for confirmation email (supports variables like {problemTitle})"
		),
});

/**
 * Update notification config request schema with conditional validations
 * - preferredTime must be null when emailFrequency is INSTANT
 * - preferredTime is required when emailFrequency is not INSTANT (for new configs)
 */
export const updateNotificationConfigSchema = baseNotificationConfigSchema
	.superRefine((data, ctx) => {
		// Validate preferredTime when emailFrequency is INSTANT
		if (data.emailFrequency === "INSTANT" && data.preferredTime !== null) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "preferredTime must be null when emailFrequency is INSTANT",
				path: ["preferredTime"],
			});
		}

		// Note: preferredTime requirement for non-INSTANT frequencies
		// is handled in the API route after checking existing config
		// because we need to check if there's an existing preferredTime
	})
	.strict();

/**
 * Type for update notification config request
 */
export type UpdateNotificationConfigRequest = z.infer<
	typeof updateNotificationConfigSchema
>;

// ============================================
// Validation Helper Functions
// ============================================

/**
 * Validates provider service route parameters
 * @param params - Route parameters object
 * @returns Validation result
 */
export function validateProviderServiceParams(params: {
	providerType?: string;
	id?: string;
}) {
	return providerServiceParamsSchema.safeParse({
		providerType: params.providerType,
		id: params.id,
	});
}

/**
 * Validates update service config request body
 * @param body - Request body object
 * @returns Validation result
 */
export function validateUpdateServiceConfig(body: unknown) {
	return updateServiceConfigSchema.safeParse(body);
}

/**
 * Validates update notification config request body
 * @param body - Request body object
 * @returns Validation result
 */
export function validateUpdateNotificationConfig(body: unknown) {
	return updateNotificationConfigSchema.safeParse(body);
}

