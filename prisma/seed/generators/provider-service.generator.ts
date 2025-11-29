// Provider Service Generator
// Generates provider service data for seeding

import { PrismaClient, ProviderType } from "@/lib/generated/prisma/client";

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
			serviceConfigSchema: {
				type: "object",
				properties: {
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch daily problem",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to fetch (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					skipWeekends: {
						type: "boolean",
						default: false,
						description: "Skip problems on weekends",
					},
					skipPremium: {
						type: "boolean",
						default: true,
						description: "Skip premium problems",
					},
					fetchOnStartup: {
						type: "boolean",
						default: false,
						description: "Fetch immediately when service is enabled",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch daily problem",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to fetch (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					skipWeekends: {
						type: "boolean",
						default: false,
						description: "Skip problems on weekends",
					},
					skipPremium: {
						type: "boolean",
						default: true,
						description: "Skip premium problems",
					},
					fetchOnStartup: {
						type: "boolean",
						default: false,
						description: "Fetch immediately when service is enabled",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					numberOfQuestions: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 50,
						description: "Number of problems to fetch",
					},
					difficulties: {
						type: "array",
						items: {
							type: "string",
							enum: ["EASY", "MEDIUM", "HARD"],
						},
						description: "Array of difficulty levels",
					},
					topics: {
						type: "array",
						items: { type: "string" },
						description: "Array of topic tags",
					},
					questionTypes: {
						type: "array",
						items: { type: "string" },
						description: "Types of questions to include",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					excludeSolved: {
						type: "boolean",
						default: true,
						description: "Exclude problems user already solved",
					},
					minRating: {
						type: "number",
						minimum: 0,
						description: "Minimum problem rating",
					},
					maxRating: {
						type: "number",
						description: "Maximum problem rating",
					},
					tags: {
						type: "array",
						items: { type: "string" },
						description: "Additional tags to filter by",
					},
					sortBy: {
						type: "string",
						enum: ["DIFFICULTY", "RATING", "ACCEPTANCE_RATE"],
						description: "Sort order field",
					},
					sortOrder: {
						type: "string",
						enum: ["ASC", "DESC"],
						description: "Sort order direction",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					numberOfQuestions: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 50,
						description: "Number of problems to fetch",
					},
					difficulties: {
						type: "array",
						items: {
							type: "string",
							enum: ["EASY", "MEDIUM", "HARD"],
						},
						description: "Array of difficulty levels",
					},
					topics: {
						type: "array",
						items: { type: "string" },
						description: "Array of topic tags",
					},
					questionTypes: {
						type: "array",
						items: { type: "string" },
						description: "Types of questions to include",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					excludeSolved: {
						type: "boolean",
						default: true,
						description: "Exclude problems user already solved",
					},
					minRating: {
						type: "number",
						minimum: 0,
						description: "Minimum problem rating",
					},
					maxRating: {
						type: "number",
						description: "Maximum problem rating",
					},
					tags: {
						type: "array",
						items: { type: "string" },
						description: "Additional tags to filter by",
					},
					sortBy: {
						type: "string",
						enum: ["DIFFICULTY", "RATING", "ACCEPTANCE_RATE"],
						description: "Sort order field",
					},
					sortOrder: {
						type: "string",
						enum: ["ASC", "DESC"],
						description: "Sort order direction",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch weekly challenges",
					},
					preferredDay: {
						type: "string",
						enum: [
							"MONDAY",
							"TUESDAY",
							"WEDNESDAY",
							"THURSDAY",
							"FRIDAY",
							"SATURDAY",
							"SUNDAY",
						],
						description: "Day of week to fetch",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includePastChallenges: {
						type: "boolean",
						default: false,
						description: "Include past weekly challenges",
					},
					notifyBeforeStart: {
						type: "boolean",
						default: true,
						description: "Notify before challenge starts",
					},
					notifyBeforeStartHours: {
						type: "number",
						default: 24,
						description: "Hours before challenge to notify",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch weekly challenges",
					},
					preferredDay: {
						type: "string",
						enum: [
							"MONDAY",
							"TUESDAY",
							"WEDNESDAY",
							"THURSDAY",
							"FRIDAY",
							"SATURDAY",
							"SUNDAY",
						],
						description: "Day of week to fetch",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includePastChallenges: {
						type: "boolean",
						default: false,
						description: "Include past weekly challenges",
					},
					notifyBeforeStart: {
						type: "boolean",
						default: true,
						description: "Notify before challenge starts",
					},
					notifyBeforeStartHours: {
						type: "number",
						default: 24,
						description: "Hours before challenge to notify",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					reminderTimes: {
						type: "array",
						items: {
							type: "string",
							format: "time",
						},
						description: "Array of times to send reminders (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeUpcoming: {
						type: "boolean",
						default: true,
						description: "Include upcoming contests",
					},
					includeOngoing: {
						type: "boolean",
						default: false,
						description: "Include ongoing contests",
					},
					minContestDuration: {
						type: "number",
						default: 60,
						description: "Minimum contest duration in minutes",
					},
					maxContestDuration: {
						type: "number",
						default: 180,
						description: "Maximum contest duration in minutes",
					},
					filterByProvider: {
						type: "boolean",
						default: true,
						description: "Filter contests by provider",
					},
					providerTypes: {
						type: "array",
						items: {
							type: "string",
							enum: ["LEETCODE", "GFG"],
						},
						description: "Array of provider types to include",
					},
				},
			},
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
			serviceConfigSchema: {
				type: "object",
				properties: {
					reminderTimes: {
						type: "array",
						items: {
							type: "string",
							format: "time",
						},
						description: "Array of times to send reminders (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeUpcoming: {
						type: "boolean",
						default: true,
						description: "Include upcoming contests",
					},
					includeOngoing: {
						type: "boolean",
						default: false,
						description: "Include ongoing contests",
					},
					minContestDuration: {
						type: "number",
						default: 60,
						description: "Minimum contest duration in minutes",
					},
					maxContestDuration: {
						type: "number",
						default: 180,
						description: "Maximum contest duration in minutes",
					},
					filterByProvider: {
						type: "boolean",
						default: true,
						description: "Filter contests by provider",
					},
					providerTypes: {
						type: "array",
						items: {
							type: "string",
							enum: ["LEETCODE", "GFG"],
						},
						description: "Array of provider types to include",
					},
				},
			},
			order: 4,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Contest service created:", gfgContestService.id);
	services.push(gfgContestService);

	// 9. Create LeetCode Topic Practice ProviderService
	console.log("📦 Creating LeetCode Topic Practice service...");
	const leetcodeTopicPractice = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Topic Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Topic Practice",
			description:
				"Practice problems focused on specific topics like Arrays, Strings, Dynamic Programming, and more",
			imageUrl: "/images/services/topic-practice.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "TOPIC_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					topics: {
						type: "array",
						items: { type: "string" },
						description: "Array of topics to practice",
					},
					numberOfQuestions: {
						type: "number",
						default: 10,
						minimum: 1,
						maximum: 50,
						description: "Number of problems per topic",
					},
					difficulties: {
						type: "array",
						items: {
							type: "string",
							enum: ["EASY", "MEDIUM", "HARD"],
						},
						description: "Array of difficulty levels",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 5,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Topic Practice service created:", leetcodeTopicPractice.id);
	services.push(leetcodeTopicPractice);

	// 10. Create GFG Topic Practice ProviderService
	console.log("📦 Creating GFG Topic Practice service...");
	const gfgTopicPractice = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Topic Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Topic Practice",
			description:
				"Practice problems focused on specific topics like Arrays, Strings, Dynamic Programming, and more",
			imageUrl: "/images/services/topic-practice.svg",
			providerType: ProviderType.GFG,
			serviceType: "TOPIC_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					topics: {
						type: "array",
						items: { type: "string" },
						description: "Array of topics to practice",
					},
					numberOfQuestions: {
						type: "number",
						default: 10,
						minimum: 1,
						maximum: 50,
						description: "Number of problems per topic",
					},
					difficulties: {
						type: "array",
						items: {
							type: "string",
							enum: ["EASY", "MEDIUM", "HARD"],
						},
						description: "Array of difficulty levels",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 5,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Topic Practice service created:", gfgTopicPractice.id);
	services.push(gfgTopicPractice);

	// 11. Create LeetCode Company Tag Practice ProviderService
	console.log("📦 Creating LeetCode Company Tag Practice service...");
	const leetcodeCompanyPractice = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Company Tag Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Company Tag Practice",
			description:
				"Practice problems frequently asked by top tech companies like Google, Amazon, Microsoft, and more",
			imageUrl: "/images/services/company-practice.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "COMPANY_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					companies: {
						type: "array",
						items: { type: "string" },
						description: "Array of company names (e.g., Google, Amazon, Microsoft)",
					},
					numberOfQuestions: {
						type: "number",
						default: 10,
						minimum: 1,
						maximum: 50,
						description: "Number of problems per company",
					},
					difficulties: {
						type: "array",
						items: {
							type: "string",
							enum: ["EASY", "MEDIUM", "HARD"],
						},
						description: "Array of difficulty levels",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 6,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Company Practice service created:", leetcodeCompanyPractice.id);
	services.push(leetcodeCompanyPractice);

	// 12. Create GFG Company Tag Practice ProviderService
	console.log("📦 Creating GFG Company Tag Practice service...");
	const gfgCompanyPractice = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Company Tag Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Company Tag Practice",
			description:
				"Practice problems frequently asked by top tech companies like Google, Amazon, Microsoft, and more",
			imageUrl: "/images/services/company-practice.svg",
			providerType: ProviderType.GFG,
			serviceType: "COMPANY_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					companies: {
						type: "array",
						items: { type: "string" },
						description: "Array of company names (e.g., Google, Amazon, Microsoft)",
					},
					numberOfQuestions: {
						type: "number",
						default: 10,
						minimum: 1,
						maximum: 50,
						description: "Number of problems per company",
					},
					difficulties: {
						type: "array",
						items: {
							type: "string",
							enum: ["EASY", "MEDIUM", "HARD"],
						},
						description: "Array of difficulty levels",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 6,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Company Practice service created:", gfgCompanyPractice.id);
	services.push(gfgCompanyPractice);

	// 13. Create LeetCode Interview Preparation ProviderService
	console.log("📦 Creating LeetCode Interview Preparation service...");
	const leetcodeInterviewPrep = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Interview Preparation",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Interview Preparation",
			description:
				"Structured interview preparation with curated problem sets and mock interview questions",
			imageUrl: "/images/services/interview-prep.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "INTERVIEW_PREP",
			serviceConfigSchema: {
				type: "object",
				properties: {
					interviewType: {
						type: "string",
						enum: ["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN", "CODING_ROUND"],
						description: "Type of interview to prepare for",
					},
					numberOfQuestions: {
						type: "number",
						default: 15,
						minimum: 5,
						maximum: 50,
						description: "Number of problems per session",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeExplanations: {
						type: "boolean",
						default: true,
						description: "Include detailed explanations",
					},
				},
			},
			order: 7,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Interview Prep service created:", leetcodeInterviewPrep.id);
	services.push(leetcodeInterviewPrep);

	// 14. Create GFG Interview Preparation ProviderService
	console.log("📦 Creating GFG Interview Preparation service...");
	const gfgInterviewPrep = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Interview Preparation",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Interview Preparation",
			description:
				"Structured interview preparation with curated problem sets and mock interview questions",
			imageUrl: "/images/services/interview-prep.svg",
			providerType: ProviderType.GFG,
			serviceType: "INTERVIEW_PREP",
			serviceConfigSchema: {
				type: "object",
				properties: {
					interviewType: {
						type: "string",
						enum: ["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN", "CODING_ROUND"],
						description: "Type of interview to prepare for",
					},
					numberOfQuestions: {
						type: "number",
						default: 15,
						minimum: 5,
						maximum: 50,
						description: "Number of problems per session",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeExplanations: {
						type: "boolean",
						default: true,
						description: "Include detailed explanations",
					},
				},
			},
			order: 7,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Interview Prep service created:", gfgInterviewPrep.id);
	services.push(gfgInterviewPrep);

	// 15. Create LeetCode Difficulty-Based Practice ProviderService
	console.log("📦 Creating LeetCode Difficulty-Based Practice service...");
	const leetcodeDifficultyPractice = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Difficulty Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Difficulty Practice",
			description:
				"Practice problems filtered by difficulty level - Easy, Medium, or Hard only",
			imageUrl: "/images/services/difficulty-practice.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "DIFFICULTY_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					difficulty: {
						type: "string",
						enum: ["EASY", "MEDIUM", "HARD"],
						description: "Difficulty level to practice",
					},
					numberOfQuestions: {
						type: "number",
						default: 10,
						minimum: 1,
						maximum: 50,
						description: "Number of problems to fetch",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					excludeSolved: {
						type: "boolean",
						default: true,
						description: "Exclude problems user already solved",
					},
				},
			},
			order: 8,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Difficulty Practice service created:", leetcodeDifficultyPractice.id);
	services.push(leetcodeDifficultyPractice);

	// 16. Create GFG Difficulty-Based Practice ProviderService
	console.log("📦 Creating GFG Difficulty-Based Practice service...");
	const gfgDifficultyPractice = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Difficulty Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Difficulty Practice",
			description:
				"Practice problems filtered by difficulty level - Easy, Medium, or Hard only",
			imageUrl: "/images/services/difficulty-practice.svg",
			providerType: ProviderType.GFG,
			serviceType: "DIFFICULTY_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					difficulty: {
						type: "string",
						enum: ["EASY", "MEDIUM", "HARD"],
						description: "Difficulty level to practice",
					},
					numberOfQuestions: {
						type: "number",
						default: 10,
						minimum: 1,
						maximum: 50,
						description: "Number of problems to fetch",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					excludeSolved: {
						type: "boolean",
						default: true,
						description: "Exclude problems user already solved",
					},
				},
			},
			order: 8,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Difficulty Practice service created:", gfgDifficultyPractice.id);
	services.push(gfgDifficultyPractice);

	// 17. Create LeetCode Problem Recommendations ProviderService
	console.log("📦 Creating LeetCode Problem Recommendations service...");
	const leetcodeRecommendations = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Problem Recommendations",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Problem Recommendations",
			description:
				"Get AI-powered problem recommendations based on your skill level and progress",
			imageUrl: "/images/services/recommendations.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "RECOMMENDATIONS",
			serviceConfigSchema: {
				type: "object",
				properties: {
					numberOfRecommendations: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of recommended problems",
					},
					basedOn: {
						type: "string",
						enum: ["SKILL_LEVEL", "PROGRESS", "WEAK_AREAS", "SIMILAR_PROBLEMS"],
						description: "Basis for recommendations",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch recommendations (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 9,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Recommendations service created:", leetcodeRecommendations.id);
	services.push(leetcodeRecommendations);

	// 18. Create GFG Problem Recommendations ProviderService
	console.log("📦 Creating GFG Problem Recommendations service...");
	const gfgRecommendations = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Problem Recommendations",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Problem Recommendations",
			description:
				"Get AI-powered problem recommendations based on your skill level and progress",
			imageUrl: "/images/services/recommendations.svg",
			providerType: ProviderType.GFG,
			serviceType: "RECOMMENDATIONS",
			serviceConfigSchema: {
				type: "object",
				properties: {
					numberOfRecommendations: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of recommended problems",
					},
					basedOn: {
						type: "string",
						enum: ["SKILL_LEVEL", "PROGRESS", "WEAK_AREAS", "SIMILAR_PROBLEMS"],
						description: "Basis for recommendations",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch recommendations (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 9,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Recommendations service created:", gfgRecommendations.id);
	services.push(gfgRecommendations);

	// 19. Create LeetCode Study Plan ProviderService
	console.log("📦 Creating LeetCode Study Plan service...");
	const leetcodeStudyPlan = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Study Plan",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Study Plan",
			description:
				"Follow structured study plans with daily problems and progress tracking",
			imageUrl: "/images/services/study-plan.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "STUDY_PLAN",
			serviceConfigSchema: {
				type: "object",
				properties: {
					planDuration: {
						type: "number",
						default: 30,
						minimum: 7,
						maximum: 365,
						description: "Duration of study plan in days",
					},
					dailyProblems: {
						type: "number",
						default: 3,
						minimum: 1,
						maximum: 10,
						description: "Number of problems per day",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					skipWeekends: {
						type: "boolean",
						default: false,
						description: "Skip problems on weekends",
					},
				},
			},
			order: 10,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Study Plan service created:", leetcodeStudyPlan.id);
	services.push(leetcodeStudyPlan);

	// 20. Create GFG Study Plan ProviderService
	console.log("📦 Creating GFG Study Plan service...");
	const gfgStudyPlan = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Study Plan",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Study Plan",
			description:
				"Follow structured study plans with daily problems and progress tracking",
			imageUrl: "/images/services/study-plan.svg",
			providerType: ProviderType.GFG,
			serviceType: "STUDY_PLAN",
			serviceConfigSchema: {
				type: "object",
				properties: {
					planDuration: {
						type: "number",
						default: 30,
						minimum: 7,
						maximum: 365,
						description: "Duration of study plan in days",
					},
					dailyProblems: {
						type: "number",
						default: 3,
						minimum: 1,
						maximum: 10,
						description: "Number of problems per day",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					skipWeekends: {
						type: "boolean",
						default: false,
						description: "Skip problems on weekends",
					},
				},
			},
			order: 10,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Study Plan service created:", gfgStudyPlan.id);
	services.push(gfgStudyPlan);

	// 21. Create LeetCode Streak Challenge ProviderService
	console.log("📦 Creating LeetCode Streak Challenge service...");
	const leetcodeStreakChallenge = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Streak Challenge",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Streak Challenge",
			description:
				"Maintain your daily problem-solving streak with motivational reminders and progress tracking",
			imageUrl: "/images/services/streak-challenge.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "STREAK_CHALLENGE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					targetStreak: {
						type: "number",
						default: 30,
						minimum: 7,
						maximum: 365,
						description: "Target streak in days",
					},
					reminderTime: {
						type: "string",
						format: "time",
						default: "20:00",
						description: "Time to send reminder if problem not solved (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch daily problem",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 11,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Streak Challenge service created:", leetcodeStreakChallenge.id);
	services.push(leetcodeStreakChallenge);

	// 22. Create GFG Streak Challenge ProviderService
	console.log("📦 Creating GFG Streak Challenge service...");
	const gfgStreakChallenge = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Streak Challenge",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Streak Challenge",
			description:
				"Maintain your daily problem-solving streak with motivational reminders and progress tracking",
			imageUrl: "/images/services/streak-challenge.svg",
			providerType: ProviderType.GFG,
			serviceType: "STREAK_CHALLENGE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					targetStreak: {
						type: "number",
						default: 30,
						minimum: 7,
						maximum: 365,
						description: "Target streak in days",
					},
					reminderTime: {
						type: "string",
						format: "time",
						default: "20:00",
						description: "Time to send reminder if problem not solved (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch daily problem",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 11,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Streak Challenge service created:", gfgStreakChallenge.id);
	services.push(gfgStreakChallenge);

	// 23. Create LeetCode Progress Tracking ProviderService
	console.log("📦 Creating LeetCode Progress Tracking service...");
	const leetcodeProgressTracking = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Progress Tracking",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Progress Tracking",
			description:
				"Track your problem-solving progress with detailed analytics and weekly reports",
			imageUrl: "/images/services/progress-tracking.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "PROGRESS_TRACKING",
			serviceConfigSchema: {
				type: "object",
				properties: {
					reportFrequency: {
						type: "string",
						enum: ["DAILY", "WEEKLY", "MONTHLY"],
						default: "WEEKLY",
						description: "Frequency of progress reports",
					},
					reportDay: {
						type: "string",
						enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
						default: "MONDAY",
						description: "Day of week for weekly reports",
					},
					reportTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to send report (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeStats: {
						type: "boolean",
						default: true,
						description: "Include detailed statistics",
					},
				},
			},
			order: 12,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Progress Tracking service created:", leetcodeProgressTracking.id);
	services.push(leetcodeProgressTracking);

	// 24. Create GFG Progress Tracking ProviderService
	console.log("📦 Creating GFG Progress Tracking service...");
	const gfgProgressTracking = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Progress Tracking",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Progress Tracking",
			description:
				"Track your problem-solving progress with detailed analytics and weekly reports",
			imageUrl: "/images/services/progress-tracking.svg",
			providerType: ProviderType.GFG,
			serviceType: "PROGRESS_TRACKING",
			serviceConfigSchema: {
				type: "object",
				properties: {
					reportFrequency: {
						type: "string",
						enum: ["DAILY", "WEEKLY", "MONTHLY"],
						default: "WEEKLY",
						description: "Frequency of progress reports",
					},
					reportDay: {
						type: "string",
						enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
						default: "MONDAY",
						description: "Day of week for weekly reports",
					},
					reportTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to send report (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeStats: {
						type: "boolean",
						default: true,
						description: "Include detailed statistics",
					},
				},
			},
			order: 12,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Progress Tracking service created:", gfgProgressTracking.id);
	services.push(gfgProgressTracking);

	// 25. Create LeetCode Custom Problem Set ProviderService
	console.log("📦 Creating LeetCode Custom Problem Set service...");
	const leetcodeCustomSet = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Custom Problem Set",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Custom Problem Set",
			description:
				"Create and manage your own custom problem sets with specific problems you want to practice",
			imageUrl: "/images/services/custom-set.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "CUSTOM_SET",
			serviceConfigSchema: {
				type: "object",
				properties: {
					problemIds: {
						type: "array",
						items: { type: "string" },
						description: "Array of problem IDs to include in the set",
					},
					randomize: {
						type: "boolean",
						default: false,
						description: "Randomize the order of problems",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 13,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Custom Set service created:", leetcodeCustomSet.id);
	services.push(leetcodeCustomSet);

	// 26. Create GFG Custom Problem Set ProviderService
	console.log("📦 Creating GFG Custom Problem Set service...");
	const gfgCustomSet = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Custom Problem Set",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Custom Problem Set",
			description:
				"Create and manage your own custom problem sets with specific problems you want to practice",
			imageUrl: "/images/services/custom-set.svg",
			providerType: ProviderType.GFG,
			serviceType: "CUSTOM_SET",
			serviceConfigSchema: {
				type: "object",
				properties: {
					problemIds: {
						type: "array",
						items: { type: "string" },
						description: "Array of problem IDs to include in the set",
					},
					randomize: {
						type: "boolean",
						default: false,
						description: "Randomize the order of problems",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					autoFetch: {
						type: "boolean",
						default: true,
						description: "Automatically fetch on schedule",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 13,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Custom Set service created:", gfgCustomSet.id);
	services.push(gfgCustomSet);

	// 27. Create LeetCode Mock Interview ProviderService
	console.log("📦 Creating LeetCode Mock Interview service...");
	const leetcodeMockInterview = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Mock Interview",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Mock Interview",
			description:
				"Simulate real interview scenarios with timed problem-solving sessions and performance feedback",
			imageUrl: "/images/services/mock-interview.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "MOCK_INTERVIEW",
			serviceConfigSchema: {
				type: "object",
				properties: {
					interviewDuration: {
						type: "number",
						default: 45,
						minimum: 15,
						maximum: 120,
						description: "Interview duration in minutes",
					},
					numberOfProblems: {
						type: "number",
						default: 2,
						minimum: 1,
						maximum: 5,
						description: "Number of problems in the interview",
					},
					difficulty: {
						type: "string",
						enum: ["EASY", "MEDIUM", "HARD", "MIXED"],
						default: "MIXED",
						description: "Difficulty level of problems",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "10:00",
						description: "Time to start mock interview (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 14,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Mock Interview service created:", leetcodeMockInterview.id);
	services.push(leetcodeMockInterview);

	// 28. Create GFG Mock Interview ProviderService
	console.log("📦 Creating GFG Mock Interview service...");
	const gfgMockInterview = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Mock Interview",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Mock Interview",
			description:
				"Simulate real interview scenarios with timed problem-solving sessions and performance feedback",
			imageUrl: "/images/services/mock-interview.svg",
			providerType: ProviderType.GFG,
			serviceType: "MOCK_INTERVIEW",
			serviceConfigSchema: {
				type: "object",
				properties: {
					interviewDuration: {
						type: "number",
						default: 45,
						minimum: 15,
						maximum: 120,
						description: "Interview duration in minutes",
					},
					numberOfProblems: {
						type: "number",
						default: 2,
						minimum: 1,
						maximum: 5,
						description: "Number of problems in the interview",
					},
					difficulty: {
						type: "string",
						enum: ["EASY", "MEDIUM", "HARD", "MIXED"],
						default: "MIXED",
						description: "Difficulty level of problems",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "10:00",
						description: "Time to start mock interview (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 14,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Mock Interview service created:", gfgMockInterview.id);
	services.push(gfgMockInterview);

	// 29. Create LeetCode Leaderboard ProviderService
	console.log("📦 Creating LeetCode Leaderboard service...");
	const leetcodeLeaderboard = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Leaderboard",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Leaderboard",
			description:
				"Compete with other users on leaderboards and track your ranking based on problems solved",
			imageUrl: "/images/services/leaderboard.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "LEADERBOARD",
			serviceConfigSchema: {
				type: "object",
				properties: {
					leaderboardType: {
						type: "string",
						enum: ["GLOBAL", "FRIENDS", "WEEKLY", "MONTHLY"],
						default: "GLOBAL",
						description: "Type of leaderboard",
					},
					updateFrequency: {
						type: "string",
						enum: ["REAL_TIME", "HOURLY", "DAILY"],
						default: "DAILY",
						description: "How often leaderboard updates",
					},
					notifyOnRankChange: {
						type: "boolean",
						default: true,
						description: "Notify when your rank changes",
					},
				},
			},
			order: 15,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Leaderboard service created:", leetcodeLeaderboard.id);
	services.push(leetcodeLeaderboard);

	// 30. Create GFG Leaderboard ProviderService
	console.log("📦 Creating GFG Leaderboard service...");
	const gfgLeaderboard = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Leaderboard",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Leaderboard",
			description:
				"Compete with other users on leaderboards and track your ranking based on problems solved",
			imageUrl: "/images/services/leaderboard.svg",
			providerType: ProviderType.GFG,
			serviceType: "LEADERBOARD",
			serviceConfigSchema: {
				type: "object",
				properties: {
					leaderboardType: {
						type: "string",
						enum: ["GLOBAL", "FRIENDS", "WEEKLY", "MONTHLY"],
						default: "GLOBAL",
						description: "Type of leaderboard",
					},
					updateFrequency: {
						type: "string",
						enum: ["REAL_TIME", "HOURLY", "DAILY"],
						default: "DAILY",
						description: "How often leaderboard updates",
					},
					notifyOnRankChange: {
						type: "boolean",
						default: true,
						description: "Notify when your rank changes",
					},
				},
			},
			order: 15,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Leaderboard service created:", gfgLeaderboard.id);
	services.push(gfgLeaderboard);

	// 31. Create LeetCode Blind 75 Practice ProviderService
	console.log("📦 Creating LeetCode Blind 75 Practice service...");
	const leetcodeBlind75 = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Blind 75 Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Blind 75 Practice",
			description:
				"Master the essential 75 problems that cover all major patterns and topics for technical interviews",
			imageUrl: "/images/services/blind-75.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "BLIND_75",
			serviceConfigSchema: {
				type: "object",
				properties: {
					progressTracking: {
						type: "boolean",
						default: true,
						description: "Track progress through the Blind 75 list",
					},
					dailyProblems: {
						type: "number",
						default: 2,
						minimum: 1,
						maximum: 5,
						description: "Number of problems per day",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 16,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Blind 75 service created:", leetcodeBlind75.id);
	services.push(leetcodeBlind75);

	// 32. Create GFG Blind 75 Practice ProviderService
	console.log("📦 Creating GFG Blind 75 Practice service...");
	const gfgBlind75 = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Blind 75 Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Blind 75 Practice",
			description:
				"Master the essential 75 problems that cover all major patterns and topics for technical interviews",
			imageUrl: "/images/services/blind-75.svg",
			providerType: ProviderType.GFG,
			serviceType: "BLIND_75",
			serviceConfigSchema: {
				type: "object",
				properties: {
					progressTracking: {
						type: "boolean",
						default: true,
						description: "Track progress through the Blind 75 list",
					},
					dailyProblems: {
						type: "number",
						default: 2,
						minimum: 1,
						maximum: 5,
						description: "Number of problems per day",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 16,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Blind 75 service created:", gfgBlind75.id);
	services.push(gfgBlind75);

	// 33. Create LeetCode NeetCode 150 Practice ProviderService
	console.log("📦 Creating LeetCode NeetCode 150 Practice service...");
	const leetcodeNeetCode150 = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "NeetCode 150 Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "NeetCode 150 Practice",
			description:
				"Follow the NeetCode 150 curated list of problems organized by patterns and difficulty",
			imageUrl: "/images/services/neetcode-150.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "NETCODE_150",
			serviceConfigSchema: {
				type: "object",
				properties: {
					patternFocus: {
						type: "string",
						enum: ["ALL", "ARRAYS", "TWO_POINTERS", "SLIDING_WINDOW", "STACK", "BINARY_SEARCH", "LINKED_LIST", "TREES", "GRAPHS", "DYNAMIC_PROGRAMMING", "BACKTRACKING", "HEAP"],
						default: "ALL",
						description: "Pattern to focus on",
					},
					dailyProblems: {
						type: "number",
						default: 3,
						minimum: 1,
						maximum: 5,
						description: "Number of problems per day",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 17,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode NeetCode 150 service created:", leetcodeNeetCode150.id);
	services.push(leetcodeNeetCode150);

	// 34. Create GFG NeetCode 150 Practice ProviderService
	console.log("📦 Creating GFG NeetCode 150 Practice service...");
	const gfgNeetCode150 = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "NeetCode 150 Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "NeetCode 150 Practice",
			description:
				"Follow the NeetCode 150 curated list of problems organized by patterns and difficulty",
			imageUrl: "/images/services/neetcode-150.svg",
			providerType: ProviderType.GFG,
			serviceType: "NETCODE_150",
			serviceConfigSchema: {
				type: "object",
				properties: {
					patternFocus: {
						type: "string",
						enum: ["ALL", "ARRAYS", "TWO_POINTERS", "SLIDING_WINDOW", "STACK", "BINARY_SEARCH", "LINKED_LIST", "TREES", "GRAPHS", "DYNAMIC_PROGRAMMING", "BACKTRACKING", "HEAP"],
						default: "ALL",
						description: "Pattern to focus on",
					},
					dailyProblems: {
						type: "number",
						default: 3,
						minimum: 1,
						maximum: 5,
						description: "Number of problems per day",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 17,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG NeetCode 150 service created:", gfgNeetCode150.id);
	services.push(gfgNeetCode150);

	// 35. Create LeetCode Grind 75 Practice ProviderService
	console.log("📦 Creating LeetCode Grind 75 Practice service...");
	const leetcodeGrind75 = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Grind 75 Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Grind 75 Practice",
			description:
				"Complete the Grind 75 problem set - a 9-week plan to prepare for coding interviews",
			imageUrl: "/images/services/grind-75.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "GRIND_75",
			serviceConfigSchema: {
				type: "object",
				properties: {
					weekNumber: {
						type: "number",
						default: 1,
						minimum: 1,
						maximum: 9,
						description: "Current week in the 9-week plan",
					},
					autoAdvance: {
						type: "boolean",
						default: true,
						description: "Automatically advance to next week when current week is complete",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 18,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Grind 75 service created:", leetcodeGrind75.id);
	services.push(leetcodeGrind75);

	// 36. Create GFG Grind 75 Practice ProviderService
	console.log("📦 Creating GFG Grind 75 Practice service...");
	const gfgGrind75 = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Grind 75 Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Grind 75 Practice",
			description:
				"Complete the Grind 75 problem set - a 9-week plan to prepare for coding interviews",
			imageUrl: "/images/services/grind-75.svg",
			providerType: ProviderType.GFG,
			serviceType: "GRIND_75",
			serviceConfigSchema: {
				type: "object",
				properties: {
					weekNumber: {
						type: "number",
						default: 1,
						minimum: 1,
						maximum: 9,
						description: "Current week in the 9-week plan",
					},
					autoAdvance: {
						type: "boolean",
						default: true,
						description: "Automatically advance to next week when current week is complete",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 18,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Grind 75 service created:", gfgGrind75.id);
	services.push(gfgGrind75);

	// 37. Create LeetCode Problem of the Week ProviderService
	console.log("📦 Creating LeetCode Problem of the Week service...");
	const leetcodeProblemOfWeek = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Problem of the Week",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Problem of the Week",
			description:
				"Get a featured problem every week with detailed solutions and community discussions",
			imageUrl: "/images/services/problem-of-week.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "PROBLEM_OF_WEEK",
			serviceConfigSchema: {
				type: "object",
				properties: {
					preferredDay: {
						type: "string",
						enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
						default: "MONDAY",
						description: "Day of week to receive problem",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problem (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeDiscussion: {
						type: "boolean",
						default: true,
						description: "Include community discussion links",
					},
				},
			},
			order: 19,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Problem of the Week service created:", leetcodeProblemOfWeek.id);
	services.push(leetcodeProblemOfWeek);

	// 38. Create GFG Problem of the Week ProviderService
	console.log("📦 Creating GFG Problem of the Week service...");
	const gfgProblemOfWeek = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Problem of the Week",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Problem of the Week",
			description:
				"Get a featured problem every week with detailed solutions and community discussions",
			imageUrl: "/images/services/problem-of-week.svg",
			providerType: ProviderType.GFG,
			serviceType: "PROBLEM_OF_WEEK",
			serviceConfigSchema: {
				type: "object",
				properties: {
					preferredDay: {
						type: "string",
						enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
						default: "MONDAY",
						description: "Day of week to receive problem",
					},
					preferredTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Preferred time to receive problem (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
					includeDiscussion: {
						type: "boolean",
						default: true,
						description: "Include community discussion links",
					},
				},
			},
			order: 19,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Problem of the Week service created:", gfgProblemOfWeek.id);
	services.push(gfgProblemOfWeek);

	// 39. Create LeetCode Algorithm Patterns ProviderService
	console.log("📦 Creating LeetCode Algorithm Patterns service...");
	const leetcodePatterns = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Algorithm Patterns",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Algorithm Patterns",
			description:
				"Learn and practice common algorithm patterns like Two Pointers, Sliding Window, DFS, BFS, and more",
			imageUrl: "/images/services/algorithm-patterns.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "ALGORITHM_PATTERNS",
			serviceConfigSchema: {
				type: "object",
				properties: {
					patterns: {
						type: "array",
						items: {
							type: "string",
							enum: ["TWO_POINTERS", "SLIDING_WINDOW", "DFS", "BFS", "BACKTRACKING", "DYNAMIC_PROGRAMMING", "GREEDY", "BINARY_SEARCH", "TRIE", "UNION_FIND", "TOPOLOGICAL_SORT", "DIVIDE_AND_CONQUER"],
						},
						description: "Array of algorithm patterns to practice",
					},
					problemsPerPattern: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of problems per pattern",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 20,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Algorithm Patterns service created:", leetcodePatterns.id);
	services.push(leetcodePatterns);

	// 40. Create GFG Algorithm Patterns ProviderService
	console.log("📦 Creating GFG Algorithm Patterns service...");
	const gfgPatterns = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Algorithm Patterns",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Algorithm Patterns",
			description:
				"Learn and practice common algorithm patterns like Two Pointers, Sliding Window, DFS, BFS, and more",
			imageUrl: "/images/services/algorithm-patterns.svg",
			providerType: ProviderType.GFG,
			serviceType: "ALGORITHM_PATTERNS",
			serviceConfigSchema: {
				type: "object",
				properties: {
					patterns: {
						type: "array",
						items: {
							type: "string",
							enum: ["TWO_POINTERS", "SLIDING_WINDOW", "DFS", "BFS", "BACKTRACKING", "DYNAMIC_PROGRAMMING", "GREEDY", "BINARY_SEARCH", "TRIE", "UNION_FIND", "TOPOLOGICAL_SORT", "DIVIDE_AND_CONQUER"],
						},
						description: "Array of algorithm patterns to practice",
					},
					problemsPerPattern: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of problems per pattern",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 20,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Algorithm Patterns service created:", gfgPatterns.id);
	services.push(gfgPatterns);

	// 41. Create LeetCode Data Structures Practice ProviderService
	console.log("📦 Creating LeetCode Data Structures Practice service...");
	const leetcodeDataStructures = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Data Structures Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Data Structures Practice",
			description:
				"Master data structures through targeted practice problems on Arrays, Linked Lists, Trees, Graphs, and more",
			imageUrl: "/images/services/data-structures.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "DATA_STRUCTURES",
			serviceConfigSchema: {
				type: "object",
				properties: {
					dataStructures: {
						type: "array",
						items: {
							type: "string",
							enum: ["ARRAY", "LINKED_LIST", "STACK", "QUEUE", "TREE", "GRAPH", "HASH_TABLE", "HEAP", "TRIE", "UNION_FIND"],
						},
						description: "Array of data structures to practice",
					},
					problemsPerStructure: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of problems per data structure",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 21,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Data Structures service created:", leetcodeDataStructures.id);
	services.push(leetcodeDataStructures);

	// 42. Create GFG Data Structures Practice ProviderService
	console.log("📦 Creating GFG Data Structures Practice service...");
	const gfgDataStructures = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Data Structures Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Data Structures Practice",
			description:
				"Master data structures through targeted practice problems on Arrays, Linked Lists, Trees, Graphs, and more",
			imageUrl: "/images/services/data-structures.svg",
			providerType: ProviderType.GFG,
			serviceType: "DATA_STRUCTURES",
			serviceConfigSchema: {
				type: "object",
				properties: {
					dataStructures: {
						type: "array",
						items: {
							type: "string",
							enum: ["ARRAY", "LINKED_LIST", "STACK", "QUEUE", "TREE", "GRAPH", "HASH_TABLE", "HEAP", "TRIE", "UNION_FIND"],
						},
						description: "Array of data structures to practice",
					},
					problemsPerStructure: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of problems per data structure",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "08:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 21,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Data Structures service created:", gfgDataStructures.id);
	services.push(gfgDataStructures);

	// 43. Create LeetCode Premium Problems ProviderService
	console.log("📦 Creating LeetCode Premium Problems service...");
	const leetcodePremium = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Premium Problems",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Premium Problems",
			description:
				"Access premium-only problems with detailed solutions and company tags (requires LeetCode Premium)",
			imageUrl: "/images/services/premium.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "PREMIUM_PROBLEMS",
			serviceConfigSchema: {
				type: "object",
				properties: {
					requirePremium: {
						type: "boolean",
						default: true,
						description: "Require LeetCode Premium subscription",
					},
					numberOfProblems: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of premium problems to fetch",
					},
					includeCompanyTags: {
						type: "boolean",
						default: true,
						description: "Include company tags in problem details",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 22,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ LeetCode Premium Problems service created:", leetcodePremium.id);
	services.push(leetcodePremium);

	// 44. Create GFG Premium Problems ProviderService
	console.log("📦 Creating GFG Premium Problems service...");
	const gfgPremium = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Premium Problems",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Premium Problems",
			description:
				"Access premium-only problems with detailed solutions and company tags (requires GFG Premium)",
			imageUrl: "/images/services/premium.svg",
			providerType: ProviderType.GFG,
			serviceType: "PREMIUM_PROBLEMS",
			serviceConfigSchema: {
				type: "object",
				properties: {
					requirePremium: {
						type: "boolean",
						default: true,
						description: "Require GFG Premium subscription",
					},
					numberOfProblems: {
						type: "number",
						default: 5,
						minimum: 1,
						maximum: 20,
						description: "Number of premium problems to fetch",
					},
					includeCompanyTags: {
						type: "boolean",
						default: true,
						description: "Include company tags in problem details",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 22,
			isActive: false,
			isComingSoon: true,
		},
	});
	console.log("✅ GFG Premium Problems service created:", gfgPremium.id);
	services.push(gfgPremium);

	// 45. Create LeetCode Random Practice ProviderService
	console.log("📦 Creating LeetCode Random Practice service...");
	const leetcodeRandom = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Random Practice",
				providerType: ProviderType.LEETCODE,
			},
		},
		update: {},
		create: {
			name: "Random Practice",
			description:
				"Get random problems to keep your skills sharp and discover new challenges",
			imageUrl: "/images/services/random-practice.svg",
			providerType: ProviderType.LEETCODE,
			serviceType: "RANDOM_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					numberOfProblems: {
						type: "number",
						default: 3,
						minimum: 1,
						maximum: 10,
						description: "Number of random problems to fetch",
					},
					excludeSolved: {
						type: "boolean",
						default: true,
						description: "Exclude problems user already solved",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 23,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ LeetCode Random Practice service created:", leetcodeRandom.id);
	services.push(leetcodeRandom);

	// 46. Create GFG Random Practice ProviderService
	console.log("📦 Creating GFG Random Practice service...");
	const gfgRandom = await prisma.providerService.upsert({
		where: {
			name_providerType: {
				name: "Random Practice",
				providerType: ProviderType.GFG,
			},
		},
		update: {},
		create: {
			name: "Random Practice",
			description:
				"Get random problems to keep your skills sharp and discover new challenges",
			imageUrl: "/images/services/random-practice.svg",
			providerType: ProviderType.GFG,
			serviceType: "RANDOM_PRACTICE",
			serviceConfigSchema: {
				type: "object",
				properties: {
					numberOfProblems: {
						type: "number",
						default: 3,
						minimum: 1,
						maximum: 10,
						description: "Number of random problems to fetch",
					},
					excludeSolved: {
						type: "boolean",
						default: true,
						description: "Exclude problems user already solved",
					},
					scheduleTime: {
						type: "string",
						format: "time",
						default: "09:00",
						description: "Time to fetch problems (HH:mm format)",
					},
					timezone: {
						type: "string",
						default: "UTC",
						description: "Timezone (e.g., UTC, America/New_York)",
					},
				},
			},
			order: 23,
			isActive: true,
			isComingSoon: false,
		},
	});
	console.log("✅ GFG Random Practice service created:", gfgRandom.id);
	services.push(gfgRandom);

	return services;
}

