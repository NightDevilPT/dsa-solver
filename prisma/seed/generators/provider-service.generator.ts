// Provider Service Generator
// Generates provider service data for seeding
// All services use simplified serviceConfigSchema with: difficulty, timezone, scheduledTime, numberOfQuestions, language

import { PrismaClient, ProviderType } from "@/lib/generated/prisma/client";

// Common timezone enum for all services
const TIMEZONE_ENUM = [
	"UTC",
	"America/New_York",
	"America/Chicago",
	"America/Denver",
	"America/Los_Angeles",
	"America/Phoenix",
	"America/Anchorage",
	"America/Toronto",
	"America/Vancouver",
	"Europe/London",
	"Europe/Paris",
	"Europe/Berlin",
	"Europe/Rome",
	"Europe/Madrid",
	"Europe/Amsterdam",
	"Europe/Stockholm",
	"Europe/Zurich",
	"Asia/Tokyo",
	"Asia/Shanghai",
	"Asia/Hong_Kong",
	"Asia/Singapore",
	"Asia/Dubai",
	"Asia/Kolkata",
	"Asia/Seoul",
	"Asia/Bangkok",
	"Asia/Jakarta",
	"Australia/Sydney",
	"Australia/Melbourne",
	"Australia/Perth",
	"Pacific/Auckland",
	"Africa/Cairo",
	"Africa/Johannesburg",
	"America/Sao_Paulo",
	"America/Mexico_City",
	"America/Buenos_Aires",
];

// Common language enum for all services
const LANGUAGE_ENUM = [
	"python",
	"javascript",
	"typescript",
	"java",
	"cpp",
	"c",
	"csharp",
	"go",
	"rust",
	"swift",
	"kotlin",
	"php",
	"ruby",
];

// Service config schema for Daily Challenge (no difficulty, no numberOfQuestions)
const getDailyChallengeConfigSchema = () => ({
	type: "object",
	properties: {
		timezone: {
			type: "string",
			enum: TIMEZONE_ENUM,
			default: "UTC",
			description: "Timezone for scheduling",
		},
		scheduledTime: {
			type: "string",
			format: "time",
			default: "09:00",
			description: "Scheduled time to fetch daily problem (HH:mm format)",
		},
		language: {
			type: "string",
			enum: LANGUAGE_ENUM,
			default: "python",
			description: "Preferred programming language for solutions",
		},
	},
});

// Service config schema for other services (includes difficulty and numberOfQuestions)
const getCommonServiceConfigSchema = () => ({
	type: "object",
	properties: {
		difficulty: {
			type: "array",
			items: {
				type: "string",
				enum: ["EASY", "MEDIUM", "HARD"],
			},
			default: [],
			description: "Array of difficulty levels to filter",
		},
		timezone: {
			type: "string",
			enum: TIMEZONE_ENUM,
			default: "UTC",
			description: "Timezone for scheduling",
		},
		scheduledTime: {
			type: "string",
			format: "time",
			default: "09:00",
			description: "Scheduled time to fetch problems (HH:mm format)",
		},
		numberOfQuestions: {
			type: "number",
			default: 5,
			minimum: 1,
			maximum: 50,
			description: "Number of problems to fetch",
		},
		language: {
			type: "string",
			enum: LANGUAGE_ENUM,
			default: "python",
			description: "Preferred programming language for solutions",
		},
	},
});

export async function generateProviderServices(prisma: PrismaClient) {
	const services = [];

	// 1. Create LeetCode Daily Challenge ProviderService
	console.log("📦 Creating LeetCode Daily Challenge service...");
	const leetcodeService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Daily Challenge",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Daily Challenge",
			description:
				"Get your daily LeetCode problem with AI-generated solutions and explanations",
			imageUrl: "/images/services/daily-challenge.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "DAILY_CHALLENGE",
			serviceConfigSchema: getDailyChallengeConfigSchema(),
			order: 1,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode service created:", leetcodeService.id);
	services.push(leetcodeService);

	// 2. Create GFG Daily Challenge ProviderService
	console.log("📦 Creating GFG Daily Challenge service...");
	const gfgService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Daily Challenge",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Daily Challenge",
			description:
				"Get your daily GeeksforGeeks problem with AI-generated solutions and explanations",
			imageUrl: "/images/services/daily-challenge.svg",
			providerType: ProviderType.GFG,
			serviceType: "DAILY_CHALLENGE",
			serviceConfigSchema: getDailyChallengeConfigSchema(),
			order: 1,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG service created:", gfgService.id);
	services.push(gfgService);

	// 3. Create LeetCode Filter Challenge ProviderService
	console.log("📦 Creating LeetCode Filter Challenge service...");
	const leetcodeFilterService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Filter Challenge",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Filter Challenge",
			description:
				"Get filtered LeetCode problems based on difficulty, topics, and more",
			imageUrl: "/images/services/filter-challenge.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "FILTER_CHALLENGE",
			serviceConfigSchema: getCommonServiceConfigSchema(),
			order: 2,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Filter service created:", leetcodeFilterService.id);
	services.push(leetcodeFilterService);

	// 4. Create GFG Filter Challenge ProviderService
	console.log("📦 Creating GFG Filter Challenge service...");
	const gfgFilterService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Filter Challenge",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Filter Challenge",
			description:
				"Get filtered GeeksforGeeks problems based on difficulty, topics, and more",
			imageUrl: "/images/services/filter-challenge.svg",
			providerType: ProviderType.GFG,
			serviceType: "FILTER_CHALLENGE",
			serviceConfigSchema: getCommonServiceConfigSchema(),
			order: 2,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Filter service created:", gfgFilterService.id);
	services.push(gfgFilterService);

	return services;
}
