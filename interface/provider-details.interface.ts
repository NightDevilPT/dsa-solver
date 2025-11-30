// Provider Details Page Interfaces
// Centralized interfaces for provider service details page and related components

import { ProviderType } from "@/lib/generated/prisma/enums";
import { ProviderService } from "@/interface/provider-service.interface";

// ============================================
// Component Props Interfaces
// ============================================

export interface ServiceDetailPageProps {
	providerType: ProviderType;
	providerId: string;
}

export interface ServiceOverviewProps {
	service: ProviderService;
}

export interface ServiceNotificationsProps {
	service: ProviderService;
	userProviderService?: UserProviderService | null;
	notificationConfig?: NotificationConfig | null;
}

export interface ServiceConfigProps {
	service: ProviderService;
	userProviderService?: UserProviderService | null;
}

// ============================================
// Database Model Interfaces
// ============================================

export interface UserProviderService {
	id: string;
	userId: string;
	providerServiceId: string;
	isEnabled: boolean;
	serviceConfig: Record<string, any> | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface NotificationConfig {
	id: string;
	userProviderServiceId: string;
	enabled: boolean;
	mailSubject: string | null;
	emailFrequency: string; // "DAILY" | "WEEKLY" | "INSTANT"
	preferredTime: string | null; // HH:mm format
	includeBruteForce: boolean;
	includeOptimized: boolean;
	includeBestPractice: boolean;
	includeAlternative: boolean;
	includeExplanationOverview: boolean;
	includeExplanationApproach: boolean;
	includeStepByStep: boolean;
	includeKeyInsights: boolean;
	includeCommonMistakes: boolean;
	includeRelatedProblems: boolean;
	includeHintsProgressive: boolean;
	includeHintsApproach: boolean;
	includeHintsDataStructure: boolean;
	includeHintsAlgorithm: boolean;
	autoSubmit: boolean;
	autoSubmitTime: string | null; // HH:mm format
	autoSubmitOnlyIfSolved: boolean;
	autoSubmitSendConfirmation: boolean;
	autoSubmitConfirmationSubject: string | null;
	createdAt: Date;
	updatedAt: Date;
}

// ============================================
// API Response Interfaces
// ============================================

export interface ProviderServiceWithUserData {
	service: ProviderService;
	userProviderService: UserProviderService | null;
	notificationConfig: NotificationConfig | null;
}

// ============================================
// API Request Interfaces
// ============================================

export interface UpdateServiceConfigRequest {
	serviceConfig: Record<string, any>;
	isEnabled?: boolean;
}

export interface UpdateNotificationConfigRequest {
	enabled?: boolean;
	mailSubject?: string | null;
	emailFrequency?: string;
	preferredTime?: string | null;
	includeBruteForce?: boolean;
	includeOptimized?: boolean;
	includeBestPractice?: boolean;
	includeAlternative?: boolean;
	includeExplanationOverview?: boolean;
	includeExplanationApproach?: boolean;
	includeStepByStep?: boolean;
	includeKeyInsights?: boolean;
	includeCommonMistakes?: boolean;
	includeRelatedProblems?: boolean;
	includeHintsProgressive?: boolean;
	includeHintsApproach?: boolean;
	includeHintsDataStructure?: boolean;
	includeHintsAlgorithm?: boolean;
	autoSubmit?: boolean;
	autoSubmitTime?: string | null;
	autoSubmitOnlyIfSolved?: boolean;
	autoSubmitSendConfirmation?: boolean;
	autoSubmitConfirmationSubject?: string | null;
}

// ============================================
// Schema Interfaces
// ============================================

export interface SchemaProperty {
	type: string;
	format?: string;
	enum?: string[] | readonly string[];
	default?: any;
	description?: string;
	minimum?: number;
	maximum?: number;
	items?: {
		type: string;
		enum?: string[] | readonly string[];
	};
}

export interface ServiceConfigSchema {
	type: string;
	properties: Record<string, SchemaProperty>;
}

// ============================================
// Tab Types
// ============================================

export type ServiceDetailTab = "overview" | "notifications" | "config";

export const VALID_SERVICE_DETAIL_TABS: ServiceDetailTab[] = [
	"overview",
	"notifications",
	"config",
];

