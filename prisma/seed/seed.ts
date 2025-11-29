import {
	generateLeetCodeProblems,
	generateGFGProblems,
} from "./generators/problem.generator";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateUser } from "./generators/user.generator";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { generateProviderServices } from "./generators/provider-service.generator";
import { generateUserProviderServices } from "./generators/user-provider-service.generator";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

export async function main() {
	console.log("🌱 Starting seed...");

	try {
		// 0. Clean all existing records (delete in reverse dependency order)
		console.log("🗑️  Cleaning all existing records...");

		// Delete dependent records first
		console.log("  → Deleting ProblemLog records...");
		const deletedProblemLogs = await prisma.problemLog.deleteMany({});
		console.log(
			`    ✅ Deleted ${deletedProblemLogs.count} ProblemLog records`
		);

		console.log("  → Deleting ScheduledTask records...");
		const deletedScheduledTasks = await prisma.scheduledTask.deleteMany({});
		console.log(
			`    ✅ Deleted ${deletedScheduledTasks.count} ScheduledTask records`
		);

		console.log("  → Deleting EncryptedCredentials records...");
		const deletedCredentials = await prisma.encryptedCredentials.deleteMany(
			{}
		);
		console.log(
			`    ✅ Deleted ${deletedCredentials.count} EncryptedCredentials records`
		);

		console.log("  → Deleting NotificationConfig records...");
		const deletedNotifications = await prisma.notificationConfig.deleteMany(
			{}
		);
		console.log(
			`    ✅ Deleted ${deletedNotifications.count} NotificationConfig records`
		);

		console.log("  → Deleting UserProviderService records...");
		const deletedUserProviderServices =
			await prisma.userProviderService.deleteMany({});
		console.log(
			`    ✅ Deleted ${deletedUserProviderServices.count} UserProviderService records`
		);

		console.log("  → Deleting Problem records...");
		const deletedProblems = await prisma.problem.deleteMany({});
		console.log(`    ✅ Deleted ${deletedProblems.count} Problem records`);

		console.log("  → Deleting ProviderService records...");
		const deletedProviderServices = await prisma.providerService.deleteMany(
			{}
		);
		console.log(
			`    ✅ Deleted ${deletedProviderServices.count} ProviderService records`
		);

		console.log("  → Deleting User records...");
		const deletedUsers = await prisma.user.deleteMany({});
		console.log(`    ✅ Deleted ${deletedUsers.count} User records`);

		console.log("✅ Database cleaned successfully!\n");

		// 1. Create dummy user
		const user = await generateUser(prisma);

		// 2. Create provider services
		const services = await generateProviderServices(prisma);

		// 3. Create UserProviderService records with NotificationConfig
		const userProviderServices = await generateUserProviderServices(
			prisma,
			user.id,
			services.map((s) => ({
				id: s.id,
				serviceType: s.serviceType,
				providerType: s.providerType,
				name: s.name,
				isActive: s.isActive,
			}))
		);

		// 4. Create dummy problems for LeetCode
		console.log("📝 Creating LeetCode dummy problems...");
		const leetcodeProblems = await generateLeetCodeProblems(prisma);
		console.log(`✅ Created ${leetcodeProblems.length} LeetCode problems`);

		// 5. Create dummy problems for GFG
		console.log("📝 Creating GFG dummy problems...");
		const gfgProblems = await generateGFGProblems(prisma);
		console.log(`✅ Created ${gfgProblems.length} GFG problems`);

		console.log("🎉 Seed completed successfully!");
		console.log("\n📊 Summary:");
		console.log(`  - User: ${user.email}`);
		console.log(`  - Provider Services: ${services.length}`);
		services.forEach((service) => {
			console.log(
				`    • ${service.name} (${service.providerType}) - ${
					service.serviceType
				} - ${service.isActive ? "Active" : "Inactive"}${
					service.isComingSoon ? " [Coming Soon]" : ""
				}`
			);
		});
		console.log(`  - UserProviderServices: ${userProviderServices.length}`);
		userProviderServices.forEach((ups) => {
			const service = services.find(
				(s) => s.id === ups.userProviderService.providerServiceId
			);
			console.log(
				`    • ${service?.name || "Unknown"} (${
					service?.providerType || "Unknown"
				}) - Enabled: ${
					ups.userProviderService.isEnabled
				} - Notifications: ${
					ups.notificationConfig.enabled ? "Enabled" : "Disabled"
				}`
			);
		});
		console.log(`  - LeetCode Problems: ${leetcodeProblems.length}`);
		console.log(`  - GFG Problems: ${gfgProblems.length}`);
	} catch (error) {
		console.error("❌ Seed failed:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

main()
	.then(() => {
		console.log("✅ Seed script finished");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Seed script failed:", error);
		process.exit(1);
	});
