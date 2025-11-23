// GFG (GeeksforGeeks) Provider Service
// Implements GFG-specific scraping logic

import { ProviderType } from "@/lib/generated/prisma/enums";
import { BaseProviderService } from "../base/base-provider.service";
import { Credentials, Problem, ProblemExample, ProblemConstraint } from "@/interface/provider.interface";

export class GFGService extends BaseProviderService {
	private readonly BASE_URL = "https://www.geeksforgeeks.org";

	constructor() {
		super(ProviderType.GFG);
	}

	/**
	 * Login to GeeksforGeeks
	 * @param credentials - User credentials (email, password)
	 * @returns Promise<boolean> - True if login successful
	 */
	async login(credentials: Credentials): Promise<boolean> {
		try {
			await this.createPage();
			if (!this.page) {
				throw new Error("Page not initialized");
			}

			// Navigate to login page (GFG-specific URL)
			await this.page.goto(`${this.BASE_URL}/user/login/`, {
				waitUntil: "networkidle2",
			});

			// Wait for login form
			await this.waitForElement('input[name="email"], input[type="email"]');

			// Fill login form (GFG-specific selectors)
			await this.page.type(
				'input[name="email"], input[type="email"]',
				credentials.email,
				{ delay: 100 }
			);
			await this.page.type(
				'input[name="password"], input[type="password"]',
				credentials.password,
				{ delay: 100 }
			);

			// Click submit button
			await this.page.click('button[type="submit"], input[type="submit"]');

			// Wait for navigation after login
			await this.waitForNavigation();

			// Check if logged in (GFG-specific check)
			// Look for logout link or user profile indicator
			const isLoggedIn =
				(await this.page.$('a[href*="/user/logout"]')) !== null ||
				(await this.page.$('a[href*="/profile/"]')) !== null ||
				(await this.page.$('[class*="user-menu"]')) !== null;

			this.isLoggedIn = isLoggedIn;

			if (!isLoggedIn) {
				await this.closeBrowser();
				return false;
			}

			return true;
		} catch (error) {
			await this.closeBrowser();
			throw new Error(
				`GFG login failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/**
	 * Scrape GFG daily problem
	 * This method works for any day - it navigates to the Problem of the Day page
	 * which always shows the current day's problem. The link with id="potd_solve_prob"
	 * is dynamically updated each day to point to the current day's problem.
	 * 
	 * @returns Promise<Problem> - Daily problem data for the current day
	 */
	async scrapeDailyQuestion(): Promise<Problem> {
		try {
			await this.createPage();
			if (!this.page) {
				throw new Error("Page not initialized");
			}

			// Navigate to Problem of the Day page
			await this.safeGoto(`${this.BASE_URL}/problem-of-the-day`, this.BASE_URL);

			// Wait for page to fully load
			await this.rateLimit(2000);

			// Find the "Solve Problem" button/link
			// Selector: <a target="_blank" href="..." id="potd_solve_prob">
			// This element should always be present for the current day's problem
			let problemUrlRelative: string | null = null;

			try {
				// Method 1: Try to find by ID (most reliable)
				await this.waitForElement('a#potd_solve_prob', 10000);
				problemUrlRelative = await this.page.evaluate(() => {
					const link = document.querySelector('a#potd_solve_prob');
					return link ? link.getAttribute('href') : null;
				});
			} catch (error) {
				// Method 2: Fallback - try to find by button text and href pattern
				console.warn('Element with id="potd_solve_prob" not found, trying fallback method');
				try {
					problemUrlRelative = await this.page.evaluate(() => {
						// Look for link containing "Solve Problem" text or button
						const links = Array.from(document.querySelectorAll('a[href*="/problems/"]'));
						for (const link of links) {
							const button = link.querySelector('button');
							if (button && button.textContent?.includes('Solve Problem')) {
								return link.getAttribute('href');
							}
						}
						// If not found, try to find first link to /problems/ in the main content
						const mainContent = document.querySelector('div[class*="problemOfTheDay"]') || 
											 document.querySelector('main') || 
											 document.body;
						if (mainContent) {
							const firstProblemLink = mainContent.querySelector('a[href*="/problems/"]');
							return firstProblemLink ? firstProblemLink.getAttribute('href') : null;
						}
						return null;
					});
				} catch (fallbackError) {
					throw new Error(
						"Daily problem link not found on GFG Problem of the Day page. " +
						"The page structure may have changed or the problem may not be available yet."
					);
				}
			}

			if (!problemUrlRelative) {
				throw new Error(
					"Daily problem link not found on GFG Problem of the Day page. " +
					"Please verify the page structure or try again later."
				);
			}

			// Validate that we have a valid problem URL
			if (!problemUrlRelative.includes('/problems/')) {
				throw new Error(
					`Invalid problem URL extracted: ${problemUrlRelative}. ` +
					"Expected URL to contain '/problems/' path."
				);
			}

			// Construct full URL
			const problemUrl = this.validateUrl(problemUrlRelative, this.BASE_URL);

			// Navigate to problem page
			await this.safeGoto(problemUrl, this.BASE_URL);

			// Wait for problem page to load
			await this.rateLimit(1000);

			// Extract problem data from the problem page
			// Title is in: <h3> inside header content div
			await this.waitForElement('div[class*="problems_header_content"] h3, div[class*="header_content"] h3', 10000);

			const title = await this.extractText('div[class*="problems_header_content"] h3, div[class*="header_content"] h3', true);

			// Difficulty is in: <span>Difficulty: <strong>Medium</strong></span>
			let difficulty = "Unknown";
			try {
				const difficultyText = await this.page.evaluate(() => {
					const descDiv = document.querySelector('div[class*="problems_header_description"], div[class*="header_description"]');
					if (!descDiv) return null;
					
					// Find span containing "Difficulty"
					const spans = Array.from(descDiv.querySelectorAll('span'));
					const difficultySpan = spans.find(span => 
						span.textContent?.includes('Difficulty')
					);
					
					if (difficultySpan) {
						const strong = difficultySpan.querySelector('strong');
						return strong ? strong.textContent?.trim() || null : null;
					}
					return null;
				});
				
				if (difficultyText) {
					difficulty = difficultyText;
				}
			} catch (error) {
				// Keep default "Unknown"
				console.warn('Failed to extract difficulty:', error);
			}

			// Extract full description HTML (includes examples and constraints)
			const fullDescription = await this.page.evaluate(() => {
				const contentDiv = document.querySelector('div[class*="problems_problem_content"], div[class*="problem_content"]');
				return contentDiv ? contentDiv.innerHTML : '';
			});

			// Parse examples from HTML (GFG has examples with images)
			const examples = await this.parseGFGExamples();

			// Parse constraints from HTML (GFG-specific format)
			const constraints = await this.parseGFGConstraints();
			
			// Extract clean description (without examples and constraints)
			const cleanDescription = fullDescription ? this.extractCleanDescription(fullDescription) : undefined;

			// Extract topics/tags (if available on GFG problem page)
			const topics = await this.extractElements(
				'a[href*="/tag/"], .tag, [class*="tag"]',
				(el) => el.textContent?.trim() || "",
				0
			).catch(() => []);

			// Extract problem ID and slug from URL
			const { id, slug } = this.extractIdAndSlugFromUrl(problemUrl);

			// Check if problem is premium (look for premium indicators)
			const isPremium = (await this.page.$('[class*="premium"], [class*="locked"]')) !== null;

			// Get today's date (UTC to ensure consistency across timezones)
			// This ensures the problem is correctly associated with the day it was scraped
			const problemDate = new Date();
			problemDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC

			return {
				id,
				slug,
				problemUrl,
				title,
				difficulty,
				topics: topics.filter((t) => t.length > 0),
				description: cleanDescription,
				examples: examples.length > 0 ? examples : undefined,
				constraints: constraints.length > 0 ? constraints : undefined,
				isPremium,
				provider: ProviderType.GFG,
				problemDate,
			};
		} catch (error) {
			await this.closeBrowser();
			throw new Error(
				`Failed to scrape GFG daily problem: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/**
	 * Parse GFG examples from the problem page
	 * GFG examples are in <pre> tags with structure:
	 * <pre><strong>Input:</strong> ... <strong>Output:</strong> ... <strong>Explanation:</strong> ...</pre>
	 * May also contain images
	 */
	private async parseGFGExamples(): Promise<ProblemExample[]> {
		if (!this.page || this.page.isClosed()) {
			return [];
		}

		try {
			const examples = await this.page.evaluate(() => {
				const examples: Array<{
					exampleNumber: number;
					input: string;
					output: string;
					explanation?: string;
					imageUrl?: string | null;
				}> = [];

				// Find all <pre> tags that contain examples
				const contentDiv = document.querySelector('div[class*="problems_problem_content"], div[class*="problem_content"]');
				if (!contentDiv) return [];
				const preElements = Array.from(contentDiv.querySelectorAll('pre'));

				preElements.forEach((pre, index) => {
					const preHTML = pre.innerHTML;
					const preText = pre.textContent || '';

					// Extract image URL if present
					let imageUrl: string | null = null;
					const imgTag = pre.querySelector('img');
					if (imgTag) {
						imageUrl = imgTag.getAttribute('src') || null;
					}

					// Parse Input, Output, Explanation from the pre tag
					// Pattern: <strong>Input:</strong> ... <strong>Output:</strong> ... <strong>Explanation:</strong> ...
					const inputMatch = preHTML.match(/<strong[^>]*>Input[^<]*<\/strong>[\s:]*([\s\S]*?)(?=<strong[^>]*>Output|<strong[^>]*>Explanation|$)/i);
					const outputMatch = preHTML.match(/<strong[^>]*>Output[^<]*<\/strong>[\s:]*([\s\S]*?)(?=<strong[^>]*>Explanation|<strong[^>]*>Input|$)/i);
					const explanationMatch = preHTML.match(/<strong[^>]*>Explanation[^<]*<\/strong>[\s:]*([\s\S]*?)(?=<strong[^>]*>Input|<strong[^>]*>Output|$)/i);

					let input = '';
					let output = '';
					let explanation: string | undefined = undefined;

					if (inputMatch && inputMatch[1]) {
						// Remove image tags from input text
						input = inputMatch[1].replace(/<img[^>]*>/gi, '').trim();
					}

					if (outputMatch && outputMatch[1]) {
						// Remove image tags from output text
						output = outputMatch[1].replace(/<img[^>]*>/gi, '').trim();
					}

					if (explanationMatch && explanationMatch[1]) {
						// Remove image tags from explanation text
						explanation = explanationMatch[1].replace(/<img[^>]*>/gi, '').trim();
					}

					// If we found input and output, add as example
					if (input && output) {
						examples.push({
							exampleNumber: index + 1,
							input,
							output,
							explanation: explanation || undefined,
							imageUrl: imageUrl || null,
						});
					}
				});

				return examples;
			});

			return examples;
		} catch (error) {
			console.warn('Failed to parse GFG examples:', error);
			return [];
		}
	}

	/**
	 * Parse GFG constraints from the problem page
	 * GFG constraints are in HTML format:
	 * <p><span><strong>Constraints:</strong></span><span>1 ≤ stones.size() ≤ 1000<br>0 ≤ x<sub>i</sub>, y<sub>i</sub> ≤ 10<sup>4</sup><br>...</span></p>
	 */
	private async parseGFGConstraints(): Promise<ProblemConstraint[]> {
		if (!this.page || this.page.isClosed()) {
			return [];
		}

		try {
			const constraints = await this.page.evaluate(() => {
				const constraints: Array<{ constraint: string }> = [];

				// Find the content div
				const contentDiv = document.querySelector('div[class*="problems_problem_content"], div[class*="problem_content"]');
				if (!contentDiv) return [];

				// Find all paragraphs that contain "Constraints"
				const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
				
				for (const p of paragraphs) {
					const pHTML = p.innerHTML;
					const pText = p.textContent || '';

					// Check if this paragraph contains "Constraints"
					if (!pText.includes('Constraints')) {
						continue;
					}

					// Method 1: Extract from HTML structure
					// Find the span that comes after the "Constraints:" strong tag
					const strongTag = p.querySelector('strong');
					if (strongTag && strongTag.textContent?.includes('Constraints')) {
						// Get all spans after the strong tag
						const allSpans = Array.from(p.querySelectorAll('span'));
						const constraintsSpanIndex = allSpans.findIndex(span => 
							span.querySelector('strong')?.textContent?.includes('Constraints')
						);

						if (constraintsSpanIndex >= 0 && constraintsSpanIndex < allSpans.length - 1) {
							// Get the next span(s) that contain the actual constraints
							for (let i = constraintsSpanIndex + 1; i < allSpans.length; i++) {
								const span = allSpans[i];
								const spanText = span.textContent?.trim() || '';
								
								if (spanText.length > 0) {
									// Split by <br> tags within the span
									const spanHTML = span.innerHTML;
									const lines = spanHTML
										.split(/<br[^>]*>/i)
										.map(line => {
											// Remove HTML tags and get text content
											const tempDiv = document.createElement('div');
											tempDiv.innerHTML = line;
											return tempDiv.textContent?.trim() || '';
										})
										.filter(line => line.length > 0);

									for (const line of lines) {
										if (line.length > 0 && line.length < 500) {
											constraints.push({
												constraint: line,
											});
										}
									}
								}
							}
						}
					}

					// Method 2: Fallback - Extract from text content if HTML method didn't work
					if (constraints.length === 0) {
						const textMatch = pText.match(/Constraints:\s*([\s\S]+)/i);
						if (textMatch && textMatch[1]) {
							const constraintsText = textMatch[1];
							const lines = constraintsText
								.split(/\n|<br>/i)
								.map(line => line.trim())
								.filter(line => line.length > 0 && !line.match(/^\s*$/));

							for (const line of lines) {
								if (line.length > 0 && line.length < 500) {
									constraints.push({
										constraint: line,
									});
								}
							}
						}
					}

					// If we found constraints, break (only process first "Constraints" paragraph)
					if (constraints.length > 0) {
						break;
					}
				}

				return constraints;
			});

			return constraints;
		} catch (error) {
			console.warn('Failed to parse GFG constraints:', error);
			return [];
		}
	}

	/**
	 * Extract problem ID and slug from GFG URL
	 * Example: https://www.geeksforgeeks.org/problems/two-sum/1 -> { id: "1", slug: "two-sum" }
	 * Example: https://www.geeksforgeeks.org/problems/maximum-stone-removal-1662179442/1 -> { id: "1", slug: "maximum-stone-removal-1662179442" }
	 */
	private extractIdAndSlugFromUrl(url: string): { id: string; slug: string } {
		// GFG URLs can be in different formats:
		// /problems/problem-name-1234567890/1
		// /problem-of-day/problem-name
		const problemsMatch = url.match(/\/problems\/([^\/]+)\/(\d+)/);
		if (problemsMatch && problemsMatch[1] && problemsMatch[2]) {
			return { id: problemsMatch[2], slug: problemsMatch[1] };
		}

		const problemOfDayMatch = url.match(/\/problem-of-day\/([^\/]+)/);
		if (problemOfDayMatch && problemOfDayMatch[1]) {
			const slug = problemOfDayMatch[1];
			return { id: slug, slug };
		}

		// Fallback: extract from last path segment
		const parts = url.split("/").filter(Boolean);
		const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
		if (lastPart) {
			return { id: lastPart, slug: lastPart };
		}

		throw new Error(`Invalid GFG problem URL: ${url}`);
	}
}


