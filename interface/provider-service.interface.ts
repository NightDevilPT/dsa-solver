// Provider Service Interfaces
// TypeScript interfaces for ProviderService API responses and requests

import { ProviderType } from "@/lib/generated/prisma/enums";

// ProviderService model structure (from Prisma)
export interface ProviderService {
	id: string;
	name: string;
	description: string;
	imageUrl: string | null;
	providerType: ProviderType;
	serviceType: string; // "DAILY_CHALLENGE" | "FILTER_CHALLENGE" | "WEEKLY_CHALLENGE" | "CONTEST_REMINDERS"
	serviceConfigSchema: any | null; // JSON schema
	order: number;
	isActive: boolean;
	isComingSoon: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Pagination metadata
export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

// Paginated ProviderServices response
export interface PaginatedProviderServices {
	services: ProviderService[];
	pagination: PaginationMeta;
}

// Query parameters for fetching provider services
export interface ProviderServiceFilters {
	page?: number;
	limit?: number;
	isActive?: boolean;
	isComingSoon?: boolean;
	serviceType?: string;
}

