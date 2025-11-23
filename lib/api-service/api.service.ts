// API Service
// Centralized service for making API requests using fetch
// Handles request/response formatting, error handling, and cookie management

import { ApiResponse } from "@/interface/api.interface";

// Request configuration options
export interface ApiRequestOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: any;
	credentials?: RequestCredentials;
}

// API Service class
class ApiService {
	private baseUrl: string;

	constructor(baseUrl: string = "") {
		this.baseUrl = baseUrl;
	}

	/**
	 * Make an API request
	 * @param endpoint - API endpoint (e.g., "/api/public/auth/login")
	 * @param options - Request options (method, headers, body, etc.)
	 * @returns Promise with ApiResponse<T>
	 */
	async request<T = any>(
		endpoint: string,
		options: ApiRequestOptions = {}
	): Promise<ApiResponse<T>> {
		const {
			method = "GET",
			headers = {},
			body,
			credentials = "include",
		} = options;

		// Build full URL
		const url = `${this.baseUrl}${endpoint}`;

		// Prepare headers
		const requestHeaders: HeadersInit = {
			"Content-Type": "application/json",
			...headers,
		};

		// Prepare request config
		const requestConfig: RequestInit = {
			method,
			headers: requestHeaders,
			credentials,
		};

		// Add body for non-GET requests
		if (body && method !== "GET") {
			requestConfig.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(url, requestConfig);
			const result: ApiResponse<T> = await response.json();

			return result;
		} catch (error) {
			console.error(`API request failed: ${endpoint}`, error);
			throw error;
		}
	}

	/**
	 * GET request
	 * @param endpoint - API endpoint
	 * @param options - Additional request options
	 * @returns Promise with ApiResponse<T>
	 */
	async get<T = any>(
		endpoint: string,
		options?: Omit<ApiRequestOptions, "method" | "body">
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "GET" });
	}

	/**
	 * POST request
	 * @param endpoint - API endpoint
	 * @param body - Request body
	 * @param options - Additional request options
	 * @returns Promise with ApiResponse<T>
	 */
	async post<T = any>(
		endpoint: string,
		body?: any,
		options?: Omit<ApiRequestOptions, "method" | "body">
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "POST", body });
	}

	/**
	 * PUT request
	 * @param endpoint - API endpoint
	 * @param body - Request body
	 * @param options - Additional request options
	 * @returns Promise with ApiResponse<T>
	 */
	async put<T = any>(
		endpoint: string,
		body?: any,
		options?: Omit<ApiRequestOptions, "method" | "body">
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "PUT", body });
	}

	/**
	 * DELETE request
	 * @param endpoint - API endpoint
	 * @param options - Additional request options
	 * @returns Promise with ApiResponse<T>
	 */
	async delete<T = any>(
		endpoint: string,
		options?: Omit<ApiRequestOptions, "method" | "body">
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "DELETE" });
	}

	/**
	 * PATCH request
	 * @param endpoint - API endpoint
	 * @param body - Request body
	 * @param options - Additional request options
	 * @returns Promise with ApiResponse<T>
	 */
	async patch<T = any>(
		endpoint: string,
		body?: any,
		options?: Omit<ApiRequestOptions, "method" | "body">
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...options, method: "PATCH", body });
	}
}

// Export singleton instance
const apiService = new ApiService();

export default apiService;

