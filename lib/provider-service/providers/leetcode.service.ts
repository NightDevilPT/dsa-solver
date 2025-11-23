// LeetCode Provider Service
// Implements LeetCode-specific scraping logic

import { BaseProviderService } from "../base/base-provider.service";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { Credentials, Problem } from "@/interface/provider.interface";

export class LeetCodeService extends BaseProviderService {
	private readonly BASE_URL = "https://leetcode.com";

	constructor() {
		super(ProviderType.LEETCODE);
	}

	/**
	 * Login to LeetCode
	 * @param credentials - User credentials (email, password)
	 * @returns Promise<boolean> - True if login successful
	 */
	async login(credentials: Credentials): Promise<boolean> {
		try {
			await this.createPage();
			if (!this.page) {
				throw new Error("Page not initialized");
			}

			// Navigate to login page
			await this.page.goto(`${this.BASE_URL}/accounts/login/`, {
				waitUntil: "networkidle2",
			});

			// Wait for login form
			await this.waitForElement("#id_login");

			// Fill login form (LeetCode-specific selectors)
			await this.page.type("#id_login", credentials.email, {
				delay: 100,
			});
			await this.page.type("#id_password", credentials.password, {
				delay: 100,
			});

			// Click submit button
			await this.page.click('button[type="submit"]');

			// Wait for navigation after login
			await this.waitForNavigation();

			// Check if logged in (LeetCode-specific check)
			// Look for logout link or user profile indicator
			const isLoggedIn =
				(await this.page.$('a[href="/accounts/logout/"]')) !== null ||
				(await this.page.$('a[href*="/profile/"]')) !== null;

			this.isLoggedIn = isLoggedIn;

			if (!isLoggedIn) {
				await this.closeBrowser();
				return false;
			}

			return true;
		} catch (error) {
			await this.closeBrowser();
			throw new Error(
				`LeetCode login failed: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	/**
	 * Scrape LeetCode daily challenge
	 * @returns Promise<Problem> - Daily problem data
	 */
	async scrapeDailyQuestion(): Promise<Problem> {
		try {
			await this.createPage();
			if (!this.page) {
				throw new Error("Page not initialized");
			}

			// Navigate to problems page
			await this.page.goto(`${this.BASE_URL}/problemset/`, {
				waitUntil: "networkidle2",
			});

			// Wait a bit for page to fully load
			await this.rateLimit(2000);

			// Find the daily problem link
			// The daily problem is the first <a> tag within <div class="w-full pb-[80px]">
			// Structure: <div class="w-full pb-[80px]"><a href="/problems/..." class="group flex flex-col...">
			// Use XPath or attribute selector to find the div with pb-[80px] class
			const dailyProblemData = await this.page.evaluate(() => {
				// Find div with class containing "w-full" and "pb-[80px]"
				const container = Array.from(
					document.querySelectorAll("div")
				).find(
					(div) =>
						div.className.includes("w-full") &&
						div.className.includes("pb-[80px]")
				);

				if (!container) {
					return null;
				}

				// Find the first <a> tag with href containing "/problems/"
				const link = container.querySelector('a[href*="/problems/"]');
				if (!link) {
					return null;
				}

				const href = link.getAttribute("href") || "";
				const problemUrlClean = href.split("?")[0];

				// Extract title
				const titleElement = link.querySelector(
					".text-body.text-sd-foreground .ellipsis.line-clamp-1"
				);
				let title = "";
				if (titleElement) {
					title = titleElement.textContent?.trim() || "";
					// Remove leading number and dot from title
					title = title.replace(/^\d+\.\s*/, "");
				}

				// Extract difficulty
				const difficultyElement = link.querySelector("p.mx-0");
				let difficulty = "Unknown";
				if (difficultyElement) {
					difficulty =
						difficultyElement.textContent?.trim() || "Unknown";
					// Normalize difficulty
					if (difficulty.toLowerCase().includes("med")) {
						difficulty = "Medium";
					} else if (difficulty.toLowerCase().includes("easy")) {
						difficulty = "Easy";
					} else if (difficulty.toLowerCase().includes("hard")) {
						difficulty = "Hard";
					}
				}

				return {
					problemUrl: problemUrlClean,
					title,
					difficulty,
				};
			});

			if (!dailyProblemData || !dailyProblemData.problemUrl) {
				throw new Error(
					"Daily problem link not found on LeetCode problemset page."
				);
			}

			const problemUrl = `${this.BASE_URL}${dailyProblemData.problemUrl}`;
			let title = dailyProblemData.title;
			let difficulty = dailyProblemData.difficulty;

			// Navigate to problem page to get more details
			await this.page.goto(problemUrl, {
				waitUntil: "networkidle2",
			});

			// Wait for problem page to load
			await this.rateLimit(1000);

			// Extract topics/tags from problem page
			// Topics are in: <div class="mt-2 flex flex-wrap gap-1 pl-7 a[href*="/tag/"]">
			const topics = await this.extractElements(
				'div.mt-2.flex.flex-wrap.gap-1.pl-7 a[href*="/tag/"]',
				(el) => el.textContent?.trim() || ""
			).catch(() => []);

			// Extract description from problem page
			// Description is in: <div data-track-load="description_content">
			const fullDescription = await this.extractText(
				'div[data-track-load="description_content"]'
			).catch(() => "");

			// Parse examples and constraints from description
			const examples = fullDescription
				? this.parseExamples(fullDescription)
				: [];
			const constraints = fullDescription
				? this.parseConstraints(fullDescription)
				: [];

			// Extract clean description (without examples and constraints)
			const cleanDescription = fullDescription
				? this.extractCleanDescription(fullDescription)
				: undefined;

			// Extract problem ID and slug from URL
			const { id, slug } = this.extractIdAndSlugFromUrl(problemUrl);

			// Check if problem is premium (look for lock icon)
			const isPremium =
				(await this.page.$('svg[data-icon="lock-keyhole"]')) !== null;

			// Get today's date
			const problemDate = new Date();
			problemDate.setHours(0, 0, 0, 0); // Set to start of day

			return {
				id,
				slug,
				problemUrl,
				title: title || slug, // Fallback to slug if title not found
				difficulty,
				topics: topics.filter((t) => t.length > 0),
				description: cleanDescription,
				examples: examples.length > 0 ? examples : undefined,
				constraints: constraints.length > 0 ? constraints : undefined,
				isPremium,
				provider: ProviderType.LEETCODE,
				problemDate,
			};
		} catch (error) {
			await this.closeBrowser();
			throw new Error(
				`Failed to scrape LeetCode daily problem: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	/**
	 * Extract problem ID and slug from LeetCode URL
	 * Example: https://leetcode.com/problems/two-sum/ -> { id: "two-sum", slug: "two-sum" }
	 */
	private extractIdAndSlugFromUrl(url: string): { id: string; slug: string } {
		const match = url.match(/\/problems\/([^\/]+)\/?/);
		if (match && match[1]) {
			const slug = match[1];
			return { id: slug, slug };
		}
		throw new Error(`Invalid LeetCode problem URL: ${url}`);
	}
}
