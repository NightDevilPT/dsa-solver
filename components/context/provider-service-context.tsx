"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	ReactNode,
} from "react";
import {
	ProviderServiceWithUserData,
	UpdateServiceConfigRequest,
	UpdateNotificationConfigRequest,
} from "@/interface/provider-details.interface";
import { toast } from "sonner";
import apiService from "@/lib/api-service/api.service";
import { ApiResponse } from "@/interface/api.interface";
import { useTranslation } from "@/hooks/useTranslation";
import { ProviderType } from "@/lib/generated/prisma/enums";

// ============================================
// Context Value Interface
// ============================================

interface ProviderServiceContextValue {
	// State
	serviceData: ProviderServiceWithUserData | null;
	loading: boolean;
	error: string | null;

	// Actions
	fetchProviderService: () => Promise<void>;
	updateServiceConfig: (
		config: UpdateServiceConfigRequest
	) => Promise<void>;
	updateNotificationConfig: (
		config: UpdateNotificationConfigRequest
	) => Promise<void>;
	refreshServiceData: () => Promise<void>;
}

// ============================================
// Context Creation
// ============================================

const ProviderServiceContext =
	createContext<ProviderServiceContextValue | undefined>(undefined);

// ============================================
// Context Provider Props
// ============================================

interface ProviderServiceContextProviderProps {
	children: ReactNode;
	providerType: ProviderType;
	providerId: string;
}

// ============================================
// Context Provider Component
// ============================================

export function ProviderServiceContextProvider({
	children,
	providerType,
	providerId,
}: ProviderServiceContextProviderProps) {
	const { t } = useTranslation();
	const [serviceData, setServiceData] =
		useState<ProviderServiceWithUserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch provider service with user data
	const fetchProviderService = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response: ApiResponse<ProviderServiceWithUserData> =
				await apiService.get(
					`/api/protected/services/${providerType}/${providerId}`
				);

			if (response.success && response.data) {
				setServiceData(response.data);
			} else {
				const errorMessage =
					response.error ||
					response.message ||
					t("providers.services.fetchError");
				setError(errorMessage);
				toast.error(errorMessage);
			}
		} catch (err: any) {
			const errorMessage =
				err.message || t("providers.services.fetchError");
			setError(errorMessage);
			toast.error(errorMessage);
			console.error("Error fetching provider service:", err);
		} finally {
			setLoading(false);
		}
	}, [providerType, providerId, t]);

	// Update service config
	const updateServiceConfig = useCallback(
		async (config: UpdateServiceConfigRequest) => {
			try {
				const response: ApiResponse<ProviderServiceWithUserData> =
					await apiService.patch(
						`/api/protected/services/${providerType}/${providerId}/config`,
						config
					);

				if (response.success && response.data) {
					setServiceData(response.data);
					toast.success(
						t("providers.serviceDetail.config.saveSuccess")
					);
				} else {
					const errorMessage =
						response.error ||
						response.message ||
						t("providers.serviceDetail.config.saveError");
					toast.error(errorMessage);
					throw new Error(errorMessage);
				}
			} catch (err: any) {
				const errorMessage =
					err.message ||
					t("providers.serviceDetail.config.saveError");
				toast.error(errorMessage);
				console.error("Error updating service config:", err);
				throw err;
			}
		},
		[providerType, providerId, t]
	);

	// Update notification config
	const updateNotificationConfig = useCallback(
		async (config: UpdateNotificationConfigRequest) => {
			try {
				const response: ApiResponse<ProviderServiceWithUserData> =
					await apiService.patch(
						`/api/protected/services/${providerType}/${providerId}/notifications`,
						config
					);

				if (response.success && response.data) {
					setServiceData(response.data);
					toast.success(
						t("providers.serviceDetail.notifications.saveSuccess")
					);
				} else {
					const errorMessage =
						response.error ||
						response.message ||
						t("providers.serviceDetail.notifications.saveError");
					toast.error(errorMessage);
					throw new Error(errorMessage);
				}
			} catch (err: any) {
				const errorMessage =
					err.message ||
					t("providers.serviceDetail.notifications.saveError");
				toast.error(errorMessage);
				console.error("Error updating notification config:", err);
				throw err;
			}
		},
		[providerType, providerId, t]
	);

	// Refresh service data
	const refreshServiceData = useCallback(async () => {
		await fetchProviderService();
	}, [fetchProviderService]);

	// Initial fetch on mount
	useEffect(() => {
		fetchProviderService();
	}, [fetchProviderService]);

	const value: ProviderServiceContextValue = {
		serviceData,
		loading,
		error,
		fetchProviderService,
		updateServiceConfig,
		updateNotificationConfig,
		refreshServiceData,
	};

	return (
		<ProviderServiceContext.Provider value={value}>
			{children}
		</ProviderServiceContext.Provider>
	);
}

// ============================================
// Custom Hook
// ============================================

export function useProviderServiceContext() {
	const context = useContext(ProviderServiceContext);
	if (context === undefined) {
		throw new Error(
			"useProviderServiceContext must be used within a ProviderServiceContextProvider"
		);
	}
	return context;
}

