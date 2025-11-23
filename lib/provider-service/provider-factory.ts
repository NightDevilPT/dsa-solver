// Provider Factory
// Creates provider service instances based on provider type

import { GFGService } from "./providers/gfg.service";
import { LeetCodeService } from "./providers/leetcode.service";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { IProviderService } from "@/interface/provider.interface";

export class ProviderFactory {
	/**
	 * Create provider service instance based on provider type
	 * @param providerType - The provider type (LEETCODE, GFG, etc.)
	 * @returns IProviderService - Provider service instance
	 * @throws Error if provider type is not supported
	 */
	static create(providerType: ProviderType): IProviderService {
		switch (providerType) {
			case ProviderType.LEETCODE:
				return new LeetCodeService();

			case ProviderType.GFG:
				return new GFGService();

			default:
				throw new Error(`Unsupported provider: ${providerType}`);
		}
	}

	/**
	 * Get all supported providers
	 * @returns ProviderType[] - Array of supported provider types
	 */
	static getSupportedProviders(): ProviderType[] {
		return [ProviderType.LEETCODE, ProviderType.GFG];
	}

	/**
	 * Check if provider is supported
	 * @param providerType - The provider type to check
	 * @returns boolean - True if provider is supported
	 */
	static isSupported(providerType: ProviderType): boolean {
		return this.getSupportedProviders().includes(providerType);
	}
}
