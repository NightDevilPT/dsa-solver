// Base Provider Service
// Abstract base class providing common browser management and utilities
// All provider services extend this class

import {
	IProviderService,
	Credentials,
	Problem,
	ProblemExample,
	ProblemConstraint,
} from "@/interface/provider.interface";
import puppeteer from "puppeteer-core";
import { Browser, Page } from "puppeteer-core";
import { ProviderType } from "@/lib/generated/prisma/enums";

export abstract class BaseProviderService implements IProviderService {
	protected browser: Browser | null = null;
	protected page: Page | null = null;
	protected isLoggedIn: boolean = false;
	private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
	private readonly DEFAULT_RETRIES = 3;
	private readonly DEFAULT_RETRY_DELAY = 2000; // 2 seconds

	constructor(protected providerType: ProviderType) {}

	// ========== Abstract Methods (Must be implemented by each provider) ==========

	/**
	 * Login to the provider platform
	 * Each provider implements provider-specific login logic
	 */
	abstract login(credentials: Credentials): Promise<boolean>;

	/**
	 * Scrape the daily question/problem from the provider
	 * Each provider implements provider-specific scraping logic
	 */
	abstract scrapeDailyQuestion(): Promise<Problem>;

	// ========== Common Browser Management ==========

	/**
	 * Initialize browser instance (shared across all providers)
	 * Uses puppeteer-core with executable path from environment
	 * Supports both local development and Vercel deployment
	 * @throws Error if browser initialization fails
	 */
	protected async initBrowser(): Promise<void> {
		if (this.browser && this.browser.isConnected()) {
			return; // Already initialized and connected
		}

		// Clean up any stale browser instance
		if (this.browser) {
			try {
				await this.browser.close();
			} catch (error) {
				// Ignore cleanup errors
			}
			this.browser = null;
		}

		// Determine executable path based on environment
		let executablePath: string | undefined;

		// Check if running on Vercel (serverless environment)
		const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV;
		const isServerless = isVercel || process.env.AWS_LAMBDA_FUNCTION_NAME;
		
		// Check if running on Windows (Windows doesn't work with @sparticuz/chromium)
		const isWindows = process.platform === "win32";
		
		// Check if CHROME_EXECUTABLE_PATH is explicitly set
		// Try both with and without NEXT_PUBLIC_ prefix for Next.js compatibility
		const customChromePath = process.env.CHROME_EXECUTABLE_PATH || process.env.NEXT_PUBLIC_CHROME_EXECUTABLE_PATH;
		
		if (customChromePath && customChromePath.trim()) {
			// Use custom Chrome path if provided (for local development)
			executablePath = customChromePath.trim();
		} else if (isWindows && !isServerless) {
			// Windows local development - try common Chrome paths first
			const commonPaths = [
				process.env.PROGRAMFILES ? `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe` : null,
				process.env["PROGRAMFILES(X86)"] ? `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe` : null,
				process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe` : null,
				"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
				"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
				"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
			].filter(Boolean) as string[];

			// Try to find Chrome in common locations (without using fs)
			// Note: We can't check if file exists without fs, so we'll just try the first common path
			// If it fails, user will get a clear error
			executablePath = commonPaths[0] || undefined;

			if (!executablePath) {
				const examplePath = this.getExampleChromePath(process.platform);
				throw new Error(
					"CHROME_EXECUTABLE_PATH environment variable is required for Windows local development.\n\n" +
					"@sparticuz/chromium doesn't work on Windows.\n\n" +
					"SOLUTION: Create a .env file in your project root and add:\n" +
					`CHROME_EXECUTABLE_PATH="${examplePath}"\n\n` +
					"Then restart your dev server (npm run dev)"
				);
			}
		} else {
			// Use @sparticuz/chromium for Vercel/serverless or non-Windows systems
			try {
				const chromium = await import("@sparticuz/chromium");
				// Disable graphics mode for better performance
				chromium.default.setGraphicsMode = false;
				executablePath = await chromium.default.executablePath();
			} catch (error) {
				// If @sparticuz/chromium fails, provide helpful error message
				const platform = process.platform;
				const examplePath = this.getExampleChromePath(platform);
				
				if (isServerless) {
					throw new Error(
						"@sparticuz/chromium is required for serverless environments. " +
						"Install it: npm install @sparticuz/chromium"
					);
				} else {
					throw new Error(
						"Failed to initialize browser with @sparticuz/chromium.\n\n" +
						"SOLUTION: Create a .env file in your project root and add:\n" +
						`CHROME_EXECUTABLE_PATH="${examplePath}"\n\n` +
						"Then restart your dev server (npm run dev)"
					);
				}
			}
		}

		// Validate executable path
		if (!executablePath || executablePath.trim().length === 0) {
			throw new Error("Chrome executable path is invalid or empty");
		}

		// Launch browser with appropriate configuration
		const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
			headless: true,
			executablePath: executablePath.trim(),
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-accelerated-2d-canvas",
				"--disable-gpu",
				"--disable-web-security",
				"--disable-features=IsolateOrigins,site-per-process",
				"--disable-blink-features=AutomationControlled",
				"--disable-infobars",
			],
			timeout: this.DEFAULT_TIMEOUT,
		};

		// Add Vercel-specific args if needed
		if (process.env.VERCEL) {
			launchOptions.args?.push(
				"--single-process",
				"--disable-software-rasterizer"
			);
		}

		try {
			this.browser = await puppeteer.launch(launchOptions);
			
			// Verify browser is actually connected
			if (!this.browser || !this.browser.isConnected()) {
				throw new Error("Browser launched but not connected");
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to launch browser: ${errorMessage}. ` +
				`Executable path: ${executablePath}`
			);
		}
	}

	/**
	 * Create new page (shared across all providers)
	 * @throws Error if page creation fails
	 */
	protected async createPage(): Promise<Page> {
		// Close existing page if any
		if (this.page) {
			try {
				await this.page.close();
			} catch (error) {
				// Ignore cleanup errors
			}
			this.page = null;
		}

		await this.initBrowser();
		
		if (!this.browser || !this.browser.isConnected()) {
			throw new Error("Browser not initialized or disconnected");
		}

		try {
			this.page = await this.browser.newPage();

			// Set default timeout for page operations
			this.page.setDefaultTimeout(this.DEFAULT_TIMEOUT);
			this.page.setDefaultNavigationTimeout(this.DEFAULT_TIMEOUT);

			// Common page settings
			await this.page.setViewport({ width: 1920, height: 1080 });
			await this.page.setUserAgent(
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
			);

			// Set extra headers to avoid detection
			await this.page.setExtraHTTPHeaders({
				'Accept-Language': 'en-US,en;q=0.9',
			});

			return this.page;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to create page: ${errorMessage}`);
		}
	}

	/**
	 * Close browser and cleanup (shared across all providers)
	 * Ensures all resources are properly cleaned up
	 */
	async closeBrowser(): Promise<void> {
		const cleanupErrors: string[] = [];

		// Close page first
		if (this.page) {
			try {
				if (!this.page.isClosed()) {
					await this.page.close();
				}
			} catch (error) {
				cleanupErrors.push(`Page close error: ${error instanceof Error ? error.message : String(error)}`);
			} finally {
				this.page = null;
			}
		}

		// Close browser
		if (this.browser) {
			try {
				if (this.browser.isConnected()) {
					await this.browser.close();
				}
			} catch (error) {
				cleanupErrors.push(`Browser close error: ${error instanceof Error ? error.message : String(error)}`);
			} finally {
				this.browser = null;
			}
		}

		// Reset state
		this.isLoggedIn = false;

		// Log cleanup errors but don't throw (cleanup should be best-effort)
		if (cleanupErrors.length > 0) {
			console.warn("Browser cleanup warnings:", cleanupErrors);
		}
	}

	// ========== Shared Utility Methods ==========

	/**
	 * Wait for element with retry logic
	 * @param selector - CSS selector to wait for
	 * @param timeout - Timeout in milliseconds (default: 30000)
	 * @param retries - Number of retries (default: 3)
	 * @throws Error if element not found after retries
	 */
	protected async waitForElement(
		selector: string,
		timeout: number = this.DEFAULT_TIMEOUT,
		retries: number = this.DEFAULT_RETRIES
	): Promise<void> {
		if (!this.page || this.page.isClosed()) {
			throw new Error("Page not initialized or closed");
		}

		if (!selector || selector.trim().length === 0) {
			throw new Error("Selector cannot be empty");
		}

		const lastError: Error[] = [];

		for (let i = 0; i < retries; i++) {
			try {
				await this.page.waitForSelector(selector.trim(), { 
					timeout,
					visible: false, // Don't require visibility, just existence
				});
				return; // Success
			} catch (error) {
				const err = error instanceof Error ? error : new Error(String(error));
				lastError.push(err);

				if (i === retries - 1) {
					throw new Error(
						`Element not found: "${selector}" after ${retries} retries. ` +
						`Last error: ${err.message}`
					);
				}

				// Wait before retry with exponential backoff
				const retryDelay = this.DEFAULT_RETRY_DELAY * Math.pow(2, i);
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}
	}

	/**
	 * Extract text from element with validation
	 * @param selector - CSS selector
	 * @param required - Whether the element is required (default: false)
	 * @returns Promise<string> - Extracted text content
	 * @throws Error if element not found and required is true
	 */
	protected async extractText(
		selector: string,
		required: boolean = false
	): Promise<string> {
		if (!this.page || this.page.isClosed()) {
			throw new Error("Page not initialized or closed");
		}

		if (!selector || selector.trim().length === 0) {
			throw new Error("Selector cannot be empty");
		}

		try {
			// Wait for element first
			await this.waitForElement(selector, 10000, 1);

			const text = await this.page.$eval(
				selector.trim(),
				(el) => el.textContent?.trim() || ""
			);

			if (required && !text) {
				throw new Error(`Element "${selector}" exists but has no text content`);
			}

			return text;
		} catch (error) {
			if (required) {
				throw new Error(
					`Failed to extract required text from "${selector}": ${error instanceof Error ? error.message : String(error)}`
				);
			}
			// Return empty string if not required
			return "";
		}
	}

	/**
	 * Extract multiple elements with validation
	 * @param selector - CSS selector
	 * @param extractor - Function to extract data from each element
	 * @param minCount - Minimum number of elements expected (default: 0)
	 * @returns Promise<T[]> - Array of extracted data
	 * @throws Error if less than minCount elements found
	 */
	protected async extractElements<T>(
		selector: string,
		extractor: (element: Element) => T,
		minCount: number = 0
	): Promise<T[]> {
		if (!this.page || this.page.isClosed()) {
			throw new Error("Page not initialized or closed");
		}

		if (!selector || selector.trim().length === 0) {
			throw new Error("Selector cannot be empty");
		}

		if (typeof extractor !== "function") {
			throw new Error("Extractor must be a function");
		}

		try {
			// Wait for at least one element if minCount > 0
			if (minCount > 0) {
				await this.waitForElement(selector, 10000, 1);
			}

			const results = await this.page.$$eval(
				selector.trim(),
				(elements, extractFn) => {
					return elements.map((el) => extractFn(el));
				},
				extractor
			);

			if (results.length < minCount) {
				throw new Error(
					`Expected at least ${minCount} elements for "${selector}", but found ${results.length}`
				);
			}

			return results;
		} catch (error) {
			throw new Error(
				`Failed to extract elements from "${selector}": ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/**
	 * Wait for navigation with timeout and retry logic
	 * @param timeout - Timeout in milliseconds (default: 30000)
	 * @param waitUntil - Navigation wait condition (default: "networkidle2")
	 * @throws Error if navigation fails after timeout
	 */
	protected async waitForNavigation(
		timeout: number = this.DEFAULT_TIMEOUT,
		waitUntil: "load" | "domcontentloaded" | "networkidle0" | "networkidle2" = "networkidle2"
	): Promise<void> {
		if (!this.page || this.page.isClosed()) {
			throw new Error("Page not initialized or closed");
		}

		try {
			await Promise.race([
				this.page.waitForNavigation({ 
					waitUntil,
					timeout,
				}),
				new Promise<never>((_, reject) =>
					setTimeout(
						() => reject(new Error(`Navigation timeout after ${timeout}ms`)),
						timeout
					)
				),
			]);
		} catch (error) {
			// Check if navigation actually completed
			const currentUrl = this.page.url();
			
			// If we have a valid URL, navigation might have completed
			if (currentUrl && currentUrl !== "about:blank") {
				// Navigation likely completed, just log warning
				console.warn(`Navigation wait warning (URL: ${currentUrl}):`, error instanceof Error ? error.message : String(error));
				return;
			}

			// Otherwise, throw the error
			throw new Error(
				`Navigation failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/**
	 * Retry operation with exponential backoff and error logging
	 * @param operation - Function to retry
	 * @param retries - Number of retries (default: 3)
	 * @param delay - Initial delay in milliseconds (default: 1000)
	 * @param operationName - Name of operation for error messages (optional)
	 * @returns Promise<T> - Result of the operation
	 * @throws Error if all retries fail
	 */
	protected async retryOperation<T>(
		operation: () => Promise<T>,
		retries: number = this.DEFAULT_RETRIES,
		delay: number = this.DEFAULT_RETRY_DELAY,
		operationName?: string
	): Promise<T> {
		if (typeof operation !== "function") {
			throw new Error("Operation must be a function");
		}

		const errors: Error[] = [];
		const opName = operationName || "operation";

		for (let i = 0; i < retries; i++) {
			try {
				const result = await operation();
				return result;
			} catch (error) {
				const err = error instanceof Error ? error : new Error(String(error));
				errors.push(err);

				if (i === retries - 1) {
					// All retries exhausted
					const errorMessages = errors.map((e, idx) => `Attempt ${idx + 1}: ${e.message}`).join("; ");
					throw new Error(
						`${opName} failed after ${retries} retries. Errors: ${errorMessages}`
					);
				}

				// Exponential backoff with jitter
				const backoffDelay = delay * Math.pow(2, i);
				const jitter = Math.random() * 0.3 * backoffDelay; // Add up to 30% jitter
				await new Promise((resolve) =>
					setTimeout(resolve, backoffDelay + jitter)
				);
			}
		}

		throw new Error(`${opName} failed after ${retries} retries`);
	}

	/**
	 * Rate limiting - add delay between requests
	 * @param delay - Delay in milliseconds (default: 1000)
	 */
	protected async rateLimit(delay: number = 1000): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

	// ========== Parsing Utilities ==========

	/**
	 * Parse examples from description text
	 * Extracts examples in format: "Example 1:\n\nInput: ...\nOutput: ...\nExplanation: ..."
	 * Also extracts image URLs from HTML if present
	 * @param description - Full description text containing examples
	 * @returns Array of parsed examples
	 */
	protected parseExamples(description: string): ProblemExample[] {
		if (!description || typeof description !== "string") {
			return [];
		}

		const examples: ProblemExample[] = [];
		
		// Match pattern: Example N:\n\nInput: ...\nOutput: ...\nExplanation: ...
		// Using [\s\S] instead of . with 's' flag for ES compatibility
		const exampleRegex = /Example\s+(\d+):\s*\n\s*\n\s*Input:\s*([\s\S]+?)\s*\n\s*Output:\s*([\s\S]+?)(?:\s*\n\s*Explanation:\s*([\s\S]+?))?(?=\s*\n\s*Example\s+\d+:|Constraints:|$)/g;
		
		let match;
		let lastIndex = 0;
		
		while ((match = exampleRegex.exec(description)) !== null) {
			// Prevent infinite loop if regex doesn't advance
			if (match.index === lastIndex) {
				break;
			}
			lastIndex = match.index;

			const exampleNumber = parseInt(match[1], 10);
			let input = match[2]?.trim() || "";
			let output = match[3]?.trim() || "";
			let explanation = match[4]?.trim() || undefined;

			// Extract image URL from input/output/explanation if present
			let imageUrl: string | null = null;
			const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
			const allText = [input, output, explanation].filter(Boolean).join(" ");
			const imageMatch = imageRegex.exec(allText);
			if (imageMatch && imageMatch[1]) {
				imageUrl = imageMatch[1];
				// Remove image tags from text
				input = input.replace(/<img[^>]*>/gi, "").trim();
				output = output.replace(/<img[^>]*>/gi, "").trim();
				if (explanation) {
					explanation = explanation.replace(/<img[^>]*>/gi, "").trim();
				}
			}

			// Validate example data
			if (isNaN(exampleNumber) || exampleNumber < 1) {
				continue; // Skip invalid example numbers
			}

			if (!input || !output) {
				continue; // Skip examples without input or output
			}

			examples.push({
				exampleNumber,
				input,
				output,
				explanation,
				imageUrl: imageUrl || null,
			});
		}

		return examples;
	}

	/**
	 * Parse constraints from description text
	 * Extracts constraints in format: "Constraints:\n\n\t1 <= nums.length <= 4 * 104\n\t..."
	 * @param description - Full description text containing constraints
	 * @returns Array of parsed constraints
	 */
	protected parseConstraints(description: string): ProblemConstraint[] {
		if (!description || typeof description !== "string") {
			return [];
		}

		const constraints: ProblemConstraint[] = [];
		
		// Find the Constraints section
		// Using [\s\S] instead of . with 's' flag for ES compatibility
		const constraintsMatch = description.match(/Constraints:\s*\n\s*\n((?:[\s\S]*?[^\n]+\n?)+)/);
		
		if (constraintsMatch && constraintsMatch[1]) {
			const constraintsText = constraintsMatch[1];
			
			// Split by lines and filter out empty lines
			const lines = constraintsText
				.split('\n')
				.map(line => line.trim())
				.filter(line => line.length > 0 && !line.match(/^\s*$/)); // Filter empty or whitespace-only lines

			// Each line is a constraint
			for (const line of lines) {
				if (line.length > 0 && line.length < 500) { // Sanity check: constraint shouldn't be too long
					constraints.push({
						constraint: line,
					});
				}
			}
		}

		return constraints;
	}

	/**
	 * Extract clean description (without examples and constraints)
	 * @param fullDescription - Full description text
	 * @returns Clean description text
	 */
	protected extractCleanDescription(fullDescription: string): string {
		if (!fullDescription || typeof fullDescription !== "string") {
			return "";
		}

		// Remove examples section
		// Using [\s\S] instead of . with 's' flag for ES compatibility
		let cleanDescription = fullDescription.replace(/Example\s+\d+:[\s\S]*?(?=Example\s+\d+:|Constraints:|$)/g, '');
		
		// Remove constraints section
		cleanDescription = cleanDescription.replace(/Constraints:[\s\S]*$/, '');
		
		// Clean up extra whitespace and normalize line breaks
		cleanDescription = cleanDescription
			.trim()
			.replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
			.replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
			.trim();
		
		return cleanDescription;
	}

	/**
	 * Validate and sanitize URL
	 * @param url - URL to validate
	 * @param baseUrl - Base URL for relative URLs
	 * @returns Validated absolute URL
	 * @throws Error if URL is invalid
	 */
	protected validateUrl(url: string, baseUrl?: string): string {
		if (!url || typeof url !== "string") {
			throw new Error("URL cannot be empty");
		}

		const trimmedUrl = url.trim();

		// If relative URL and baseUrl provided, construct absolute URL
		if (trimmedUrl.startsWith("/") && baseUrl) {
			const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
			return `${base}${trimmedUrl}`;
		}

		// Validate URL format
		try {
			new URL(trimmedUrl);
			return trimmedUrl;
		} catch {
			if (baseUrl) {
				// Try with base URL
				try {
					return new URL(trimmedUrl, baseUrl).href;
				} catch {
					throw new Error(`Invalid URL: ${trimmedUrl}`);
				}
			}
			throw new Error(`Invalid URL: ${trimmedUrl}`);
		}
	}

	/**
	 * Safe navigation to URL with error handling
	 * @param url - URL to navigate to
	 * @param options - Navigation options
	 * @throws Error if navigation fails
	 */
	/**
	 * Safe navigation to URL with error handling
	 * @param url - URL to navigate to
	 * @param baseUrl - Base URL for relative URLs (optional)
	 * @param options - Navigation options
	 * @throws Error if navigation fails
	 */
	protected async safeGoto(
		url: string,
		baseUrl?: string,
		options?: {
			waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
			timeout?: number;
		}
	): Promise<void> {
		if (!this.page || this.page.isClosed()) {
			throw new Error("Page not initialized or closed");
		}

		const validatedUrl = this.validateUrl(url, baseUrl);
		const waitUntil = options?.waitUntil || "networkidle2";
		const timeout = options?.timeout || this.DEFAULT_TIMEOUT;

		try {
			await this.page.goto(validatedUrl, {
				waitUntil,
				timeout,
			});
		} catch (error) {
			throw new Error(
				`Failed to navigate to ${validatedUrl}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/**
	 * Get example Chrome path for error message
	 * @param platform - OS platform
	 * @returns Example path string
	 */
	private getExampleChromePath(platform: string): string {
		if (platform === "win32") {
			return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
		} else if (platform === "darwin") {
			return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
		} else {
			return "/usr/bin/google-chrome";
		}
	}
}
