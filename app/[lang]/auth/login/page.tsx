"use client";

import { LoginForm } from "@/components/shared/login-form";
import { useRouter, usePathname } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const pathname = usePathname();

	const handleSuccess = () => {
		// Extract locale from current pathname
		const locale = pathname?.split("/")[1] || "en";
		router.push(`/${locale}/dashboard`);
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md">
				<LoginForm onSuccess={handleSuccess} />
			</div>
		</div>
	);
}