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
		const timezones = [
			"UTC",
			"America/New_York",
			"America/Chicago",
			"America/Los_Angeles",
			"Europe/London",
			"Europe/Paris",
			"Asia/Tokyo",
			"Asia/Kolkata",
			"Australia/Sydney",
		];

		const languages = [
			"python",
			"javascript",
			"typescript",
			"java",
			"cpp",
			"go",
			"rust",
		];

		const scheduledTimes = ["08:00", "09:00", "10:00", "14:00", "18:00"];

		let serviceConfig: any = {};

		if (service.serviceType === "DAILY_CHALLENGE") {
			// Daily Challenge: only timezone, scheduledTime, and language
			serviceConfig = {
				timezone: timezones[Math.floor(Math.random() * timezones.length)],
				scheduledTime:
					scheduledTimes[Math.floor(Math.random() * scheduledTimes.length)],
				language: languages[Math.floor(Math.random() * languages.length)],
			};
		} else {
			// Other services: include difficulty and numberOfQuestions
			const difficulties = [
				["EASY"],
				["MEDIUM"],
				["HARD"],
				["EASY", "MEDIUM"],
				["MEDIUM", "HARD"],
				["EASY", "MEDIUM", "HARD"],
			][Math.floor(Math.random() * 6)];

			serviceConfig = {
				difficulty: difficulties,
				timezone: timezones[Math.floor(Math.random() * timezones.length)],
				scheduledTime:
					scheduledTimes[Math.floor(Math.random() * scheduledTimes.length)],
				numberOfQuestions: Math.floor(Math.random() * 5) + 3, // 3-7 questions
				language: languages[Math.floor(Math.random() * languages.length)],
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
						: serviceConfig.scheduledTime || "09:00",
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
