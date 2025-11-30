"use client";

import { ReactNode } from "react";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { ProviderServiceContextProvider } from "@/components/context/provider-service-context";

// ============================================
// Provider Service Provider Props
// ============================================

interface ProviderServiceProviderProps {
	children: ReactNode;
	providerType: ProviderType;
	providerId: string;
}

// ============================================
// Provider Service Provider Component
// ============================================

export function ProviderServiceProvider({
	children,
	providerType,
	providerId,
}: ProviderServiceProviderProps) {
	return (
		<ProviderServiceContextProvider
			providerType={providerType}
			providerId={providerId}
		>
			{children}
		</ProviderServiceContextProvider>
	);
}
