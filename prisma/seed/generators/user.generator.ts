// User Generator
// Generates dummy user data for seeding

import { PrismaClient } from "@/lib/generated/prisma/client";

export async function generateUser(prisma: PrismaClient) {
	console.log("👤 Creating dummy user...");
	const user = await prisma.user.upsert({
		where: { email: "pawankumartadagsingh@gmail.com" },
		update: {},
		create: {
			email: "pawankumartadagsingh@gmail.com",
			username: "pawan_kumar",
			firstName: "Pawan",
			lastName: "Kumar",
			avatar: null,
			emailVerified: true,
			emailVerifiedAt: new Date(),
			isActive: true,
		},
	});
	console.log("✅ User created:", user.email);
	return user;
}

