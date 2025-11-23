// Provider Service Interfaces
// Defines types for provider services, credentials, and problems

import { ProviderType } from "@/lib/generated/prisma/enums";

/**
 * Credentials for provider authentication
 */
export interface Credentials {
	email: string;
	password: string;
}

/**
 * Example structure for problem examples
 */
export interface ProblemExample {
	exampleNumber: number;
	input: string;
	output: string;
	explanation?: string;
	imageUrl?: string | null; // Image URL if example contains an image
}

/**
 * Constraint structure for problem constraints
 */
export interface ProblemConstraint {
	constraint: string;
}

/**
 * Problem data structure scraped from providers
 */
export interface Problem {
	id: string;
	slug: string;
	problemUrl: string;
	title: string;
	difficulty: string;
	topics: string[];
	description?: string;
	examples?: ProblemExample[];
	constraints?: ProblemConstraint[];
	isPremium?: boolean;
	provider: ProviderType;
	problemDate: Date;
}

/**
 * Provider service interface
 * All provider services must implement these methods
 */
export interface IProviderService {
	/**
	 * Login to the provider platform
	 * @param credentials - User credentials (email, password)
	 * @returns Promise<boolean> - True if login successful, false otherwise
	 */
	login(credentials: Credentials): Promise<boolean>;

	/**
	 * Scrape the daily question/problem from the provider
	 * @returns Promise<Problem> - The daily problem data
	 */
	scrapeDailyQuestion(): Promise<Problem>;

	/**
	 * Close browser and cleanup resources
	 * Should be called after operations are complete
	 */
	closeBrowser(): Promise<void>;
}

