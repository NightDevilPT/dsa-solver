// User Provider Service Generator
// Generates user provider service data with notification configs for seeding

import { PrismaClient } from "@/lib/generated/prisma/client";

export async function generateUserProviderServices(
	prisma: PrismaClient,
	userId: string,
	providerServices: Array<{
		id: string;
		serviceType: string;
		providerType: string;
		name: string;
		isActive: boolean;
	}>
) {
	console.log("🔗 Creating UserProviderService records...");

	// Select 2-4 random active services for the user (prioritize DAILY_CHALLENGE and FILTER_CHALLENGE)
	const activeServices = providerServices.filter(
		(service) => service.isActive
	);
	const dailyAndFilterServices = activeServices.filter(
		(service) =>
			service.serviceType === "DAILY_CHALLENGE" ||
			service.serviceType === "FILTER_CHALLENGE"
	);
	const otherActiveServices = activeServices.filter(
		(service) =>
			service.serviceType !== "DAILY_CHALLENGE" &&
			service.serviceType !== "FILTER_CHALLENGE"
	);

	// Select 2-4 services (prefer daily/filter, but can include others)
	const numServices = Math.floor(Math.random() * 3) + 2; // 2-4 services
	const selectedServices = [
		...dailyAndFilterServices
			.sort(() => Math.random() - 0.5)
			.slice(0, Math.min(numServices, dailyAndFilterServices.length)),
		...otherActiveServices
			.sort(() => Math.random() - 0.5)
			.slice(0, Math.max(0, numServices - dailyAndFilterServices.length)),
	].slice(0, numServices);

	const userProviderServices = [];

	for (const service of selectedServices) {
		// Generate service config based on service type
		let serviceConfig: any = {};
		if (service.serviceType === "DAILY_CHALLENGE") {
			serviceConfig = {
				autoFetch: true,
				preferredTime: "09:00",
				timezone: "UTC",
				skipWeekends: false,
				skipPremium: true,
				fetchOnStartup: false,
			};
		} else if (service.serviceType === "FILTER_CHALLENGE") {
			// Randomize filter config for variety
			const difficulties = [
				["EASY"],
				["MEDIUM"],
				["HARD"],
				["EASY", "MEDIUM"],
				["MEDIUM", "HARD"],
			][Math.floor(Math.random() * 5)];
			const topics = [
				["ARRAY", "STRING"],
				["DYNAMIC_PROGRAMMING", "TWO_POINTERS"],
				["HASH_TABLE", "STRING"],
				["ARRAY", "STRING", "DYNAMIC_PROGRAMMING"],
			][Math.floor(Math.random() * 4)];

			serviceConfig = {
				numberOfQuestions: Math.floor(Math.random() * 5) + 3, // 3-7 questions
				difficulties,
				topics,
				questionTypes: ["PROBLEM_OF_THE_DAY", "PRACTICE_PROBLEM"],
				scheduleTime: ["08:00", "09:00", "10:00"][
					Math.floor(Math.random() * 3)
				],
				autoFetch: true,
				timezone: "UTC",
				excludeSolved: true,
				sortBy: ["DIFFICULTY", "RATING", "ACCEPTANCE_RATE"][
					Math.floor(Math.random() * 3)
				],
				sortOrder: ["ASC", "DESC"][Math.floor(Math.random() * 2)],
			};
		} else if (service.serviceType === "WEEKLY_CHALLENGE") {
			serviceConfig = {
				autoFetch: true,
				preferredDay: ["MONDAY", "TUESDAY", "WEDNESDAY"][
					Math.floor(Math.random() * 3)
				],
				preferredTime: "09:00",
				timezone: "UTC",
				includePastChallenges: false,
				notifyBeforeStart: true,
				notifyBeforeStartHours: 24,
			};
		} else if (service.serviceType === "CONTEST_REMINDERS") {
			serviceConfig = {
				reminderTimes: ["24:00", "12:00", "01:00"],
				timezone: "UTC",
				includeUpcoming: true,
				includeOngoing: false,
				minContestDuration: 60,
				maxContestDuration: 180,
				filterByProvider: true,
				providerTypes: [service.providerType],
			};
		}

		// Create UserProviderService
		const userProviderService = await prisma.userProviderService.create({
			data: {
				userId,
				providerServiceId: service.id,
				isEnabled: true,
				serviceConfig: serviceConfig as any,
			},
		});

		console.log(
			`  ✅ Created UserProviderService: ${service.name} (${service.providerType})`
		);

		// Create NotificationConfig for this UserProviderService with varied settings
		const includeOptimized = Math.random() > 0.3; // 70% chance
		const includeBestPractice = Math.random() > 0.7; // 30% chance
		const includeStepByStep = Math.random() > 0.5; // 50% chance
		const includeKeyInsights = Math.random() > 0.4; // 60% chance
		const autoSubmit = Math.random() > 0.8; // 20% chance

		const notificationConfig = await prisma.notificationConfig.create({
			data: {
				userProviderServiceId: userProviderService.id,
				enabled: true,
				mailSubject:
					service.serviceType === "DAILY_CHALLENGE"
						? `Your Daily ${service.name}: {problemTitle}`
						: service.serviceType === "FILTER_CHALLENGE"
						? `Your ${service.name} Problems: {numberOfQuestions} problems ready`
						: service.serviceType === "WEEKLY_CHALLENGE"
						? `Weekly Challenge Starting: {contestName}`
						: `Contest Reminder: {contestName}`,
				emailFrequency:
					service.serviceType === "CONTEST_REMINDERS"
						? "INSTANT"
						: "DAILY",
				preferredTime:
					service.serviceType === "CONTEST_REMINDERS"
						? null
						: serviceConfig.preferredTime ||
						  serviceConfig.scheduleTime ||
						  "09:00",
				includeBruteForce: false,
				includeOptimized,
				includeBestPractice,
				includeAlternative: includeOptimized && Math.random() > 0.6, // 40% chance if optimized is included
				includeExplanationOverview: true,
				includeExplanationApproach: true,
				includeStepByStep,
				includeKeyInsights,
				includeCommonMistakes: Math.random() > 0.6, // 40% chance
				includeRelatedProblems: Math.random() > 0.7, // 30% chance
				includeHintsProgressive: Math.random() > 0.5, // 50% chance
				includeHintsApproach: Math.random() > 0.6, // 40% chance
				includeHintsDataStructure: Math.random() > 0.7, // 30% chance
				includeHintsAlgorithm: Math.random() > 0.7, // 30% chance
				autoSubmit,
				autoSubmitTime: autoSubmit ? "10:00" : null,
				autoSubmitOnlyIfSolved: true,
				autoSubmitSendConfirmation: true,
				autoSubmitConfirmationSubject: autoSubmit
					? "Solution Submitted: {problemTitle}"
					: null,
				preferredLanguage: ["python", "typescript", "java", "cpp"][
					Math.floor(Math.random() * 4)
				],
			},
		});

		console.log(`  ✅ Created NotificationConfig for ${service.name}`);

		userProviderServices.push({
			userProviderService,
			notificationConfig,
		});
	}

	console.log(
		`✅ Created ${userProviderServices.length} UserProviderService records with NotificationConfig`
	);

	return userProviderServices;
}
