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

	// 5. Create LeetCode Weekly Challenge ProviderService
	console.log("📦 Creating LeetCode Weekly Challenge service...");
	const leetcodeWeeklyService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Weekly Challenge",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Weekly Challenge",
			description:
				"Participate in weekly coding challenges with AI-generated solutions",
			imageUrl: "/images/services/weekly-challenge.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "WEEKLY_CHALLENGE",
			serviceConfigSchema: getCommonServiceConfigSchema(),
			order: 3,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Weekly service created:", leetcodeWeeklyService.id);
	services.push(leetcodeWeeklyService);

	// 6. Create GFG Weekly Challenge ProviderService
	console.log("📦 Creating GFG Weekly Challenge service...");
	const gfgWeeklyService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Weekly Challenge",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Weekly Challenge",
			description:
				"Participate in weekly coding challenges with AI-generated solutions",
			imageUrl: "/images/services/weekly-challenge.svg",
			providerType: ProviderType.GFG,
			serviceType: "WEEKLY_CHALLENGE",
			serviceConfigSchema: getCommonServiceConfigSchema(),
			order: 3,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Weekly service created:", gfgWeeklyService.id);
	services.push(gfgWeeklyService);

	// 7. Create LeetCode Contest Reminders ProviderService
	console.log("📦 Creating LeetCode Contest Reminders service...");
	const leetcodeContestService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Contest Reminders",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Contest Reminders",
			description:
				"Get reminders for upcoming coding contests and competitions",
			imageUrl: "/images/services/contest-reminders.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "CONTEST_REMINDERS",
			serviceConfigSchema: getCommonServiceConfigSchema(),
			order: 4,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Contest service created:", leetcodeContestService.id);
	services.push(leetcodeContestService);

	// 8. Create GFG Contest Reminders ProviderService
	console.log("📦 Creating GFG Contest Reminders service...");
	const gfgContestService = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Contest Reminders",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Contest Reminders",
			description:
				"Get reminders for upcoming coding contests and competitions",
			imageUrl: "/images/services/contest-reminders.svg",
			providerType: ProviderType.GFG,
			serviceType: "CONTEST_REMINDERS",
			serviceConfigSchema: getCommonServiceConfigSchema(),
			order: 4,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Contest service created:", gfgContestService.id);
	services.push(gfgContestService);

	// Continue with all other services using the same simplified schema
	// 9-46: All other services follow the same pattern
	const additionalServices = [
		{ name: "Topic Practice", serviceType: "TOPIC_PRACTICE", order: 5, isActive: true },
		{ name: "Company Tag Practice", serviceType: "COMPANY_PRACTICE", order: 6, isActive: true },
		{ name: "Interview Preparation", serviceType: "INTERVIEW_PREP", order: 7, isActive: true },
		{ name: "Difficulty Practice", serviceType: "DIFFICULTY_PRACTICE", order: 8, isActive: true },
		{ name: "Problem Recommendations", serviceType: "RECOMMENDATIONS", order: 9, isActive: false, isComingSoon: true },
		{ name: "Study Plan", serviceType: "STUDY_PLAN", order: 10, isActive: false, isComingSoon: true },
		{ name: "Streak Challenge", serviceType: "STREAK_CHALLENGE", order: 11, isActive: false, isComingSoon: true },
		{ name: "Progress Tracking", serviceType: "PROGRESS_TRACKING", order: 12, isActive: false, isComingSoon: true },
		{ name: "Custom Problem Set", serviceType: "CUSTOM_SET", order: 13, isActive: true },
		{ name: "Mock Interview", serviceType: "MOCK_INTERVIEW", order: 14, isActive: false, isComingSoon: true },
		{ name: "Leaderboard", serviceType: "LEADERBOARD", order: 15, isActive: false, isComingSoon: true },
		{ name: "Blind 75 Practice", serviceType: "BLIND_75", order: 16, isActive: true },
		{ name: "NeetCode 150 Practice", serviceType: "NETCODE_150", order: 17, isActive: true },
		{ name: "Grind 75 Practice", serviceType: "GRIND_75", order: 18, isActive: true },
		{ name: "Problem of the Week", serviceType: "PROBLEM_OF_WEEK", order: 19, isActive: true },
		{ name: "Algorithm Patterns", serviceType: "ALGORITHM_PATTERNS", order: 20, isActive: true },
		{ name: "Data Structures Practice", serviceType: "DATA_STRUCTURES", order: 21, isActive: true },
		{ name: "Premium Problems", serviceType: "PREMIUM_PROBLEMS", order: 22, isActive: false, isComingSoon: true },
		{ name: "Random Practice", serviceType: "RANDOM_PRACTICE", order: 23, isActive: true },
	];

	const descriptions: Record<string, string> = {
		"Topic Practice": "Practice problems focused on specific topics like Arrays, Strings, Dynamic Programming, and more",
		"Company Tag Practice": "Practice problems frequently asked by top tech companies like Google, Amazon, Microsoft, and more",
		"Interview Preparation": "Structured interview preparation with curated problem sets and mock interview questions",
		"Difficulty Practice": "Practice problems filtered by difficulty level - Easy, Medium, or Hard only",
		"Problem Recommendations": "Get AI-powered problem recommendations based on your skill level and progress",
		"Study Plan": "Follow structured study plans with daily problems and progress tracking",
		"Streak Challenge": "Maintain your daily problem-solving streak with motivational reminders and progress tracking",
		"Progress Tracking": "Track your problem-solving progress with detailed analytics and weekly reports",
		"Custom Problem Set": "Create and manage your own custom problem sets with specific problems you want to practice",
		"Mock Interview": "Simulate real interview scenarios with timed problem-solving sessions and performance feedback",
		"Leaderboard": "Compete with other users on leaderboards and track your ranking based on problems solved",
		"Blind 75 Practice": "Master the essential 75 problems that cover all major patterns and topics for technical interviews",
		"NeetCode 150 Practice": "Follow the NeetCode 150 curated list of problems organized by patterns and difficulty",
		"Grind 75 Practice": "Complete the Grind 75 problem set - a 9-week plan to prepare for coding interviews",
		"Problem of the Week": "Get a featured problem every week with detailed solutions and community discussions",
		"Algorithm Patterns": "Learn and practice common algorithm patterns like Two Pointers, Sliding Window, DFS, BFS, and more",
		"Data Structures Practice": "Master data structures through targeted practice problems on Arrays, Linked Lists, Trees, Graphs, and more",
		"Premium Problems": "Access premium-only problems with detailed solutions and company tags (requires Premium subscription)",
		"Random Practice": "Get random problems to keep your skills sharp and discover new challenges",
	};

	const imageUrls: Record<string, string> = {
		"Topic Practice": "/images/services/topic-practice.svg",
		"Company Tag Practice": "/images/services/company-practice.svg",
		"Interview Preparation": "/images/services/interview-prep.svg",
		"Difficulty Practice": "/images/services/difficulty-practice.svg",
		"Problem Recommendations": "/images/services/recommendations.svg",
		"Study Plan": "/images/services/study-plan.svg",
		"Streak Challenge": "/images/services/streak-challenge.svg",
		"Progress Tracking": "/images/services/progress-tracking.svg",
		"Custom Problem Set": "/images/services/custom-set.svg",
		"Mock Interview": "/images/services/mock-interview.svg",
		"Leaderboard": "/images/services/leaderboard.svg",
		"Blind 75 Practice": "/images/services/blind-75.svg",
		"NeetCode 150 Practice": "/images/services/neetcode-150.svg",
		"Grind 75 Practice": "/images/services/grind-75.svg",
		"Problem of the Week": "/images/services/problem-of-week.svg",
		"Algorithm Patterns": "/images/services/algorithm-patterns.svg",
		"Data Structures Practice": "/images/services/data-structures.svg",
		"Premium Problems": "/images/services/premium.svg",
		"Random Practice": "/images/services/random-practice.svg",
	};

	for (const serviceConfig of additionalServices) {
		for (const providerType of [ProviderType.LEETCODE, ProviderType.GFG]) {
			const serviceName = `${serviceConfig.name} ${providerType === ProviderType.LEETCODE ? "LeetCode" : "GFG"}`;
			console.log(`📦 Creating ${serviceName} service...`);

			const service = await prisma.providerService.upsert({
				where: {
					name_providerType: {
						name: serviceConfig.name,
						providerType: providerType,
					},
				},
				update: {},
				create: {
					name: serviceConfig.name,
					description: descriptions[serviceConfig.name] || `${serviceConfig.name} service`,
					imageUrl: imageUrls[serviceConfig.name] || "/images/services/default.svg",
					providerType: providerType,
					serviceType: serviceConfig.serviceType,
					serviceConfigSchema: getCommonServiceConfigSchema(),
					order: serviceConfig.order,
					isActive: serviceConfig.isActive ?? true,
					isComingSoon: serviceConfig.isComingSoon ?? false,
				},
			});

			console.log(`✅ ${serviceName} service created:`, service.id);
			services.push(service);
		}
	}

	return services;
}
