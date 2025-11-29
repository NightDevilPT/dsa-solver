// Problem Generator
// Generates dummy problem data with solutions, explanations, and hints

import {
	PrismaClient,
	ProviderType,
	QuestionType,
} from "@/lib/generated/prisma/client";

// Helper function to generate solutions based on problem difficulty and topics
export function generateSolutions(
	title: string,
	difficulty: string,
	topics: string[]
): any {
	const isEasy = difficulty.toLowerCase() === "easy";
	const isHard = difficulty.toLowerCase() === "hard";
	const hasDP = topics.some((t) => t.toLowerCase().includes("dynamic"));
	const hasHash = topics.some((t) => t.toLowerCase().includes("hash"));

	// Brute Force Solution
	const bruteForce = {
		id: `brute-force-${title.toLowerCase().replace(/\s+/g, "-")}`,
		approach: "Brute Force - Nested Loops",
		language: "typescript",
		code: `function solve(nums: number[]): number {
  // Brute force approach
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // Check condition
      if (/* condition */) {
        return /* result */;
      }
    }
  }
  return -1;
}`,
		complexity: {
			time: {
				notation: "O(n²)",
				best: "O(n²)",
				average: "O(n²)",
				worst: "O(n²)",
				explanation: "Nested loops iterate through all pairs",
			},
			space: {
				notation: "O(1)",
				best: "O(1)",
				average: "O(1)",
				worst: "O(1)",
				explanation: "Only using constant extra space",
			},
		},
		explanation: `Brute force approach checks all possible combinations using nested loops.`,
		stepByStep: [
			{
				stepNumber: 1,
				title: "Initialize outer loop",
				description: "Iterate through each element",
				codeSnippet: "for (let i = 0; i < nums.length; i++)",
			},
			{
				stepNumber: 2,
				title: "Initialize inner loop",
				description: "For each element, check all subsequent elements",
				codeSnippet: "for (let j = i + 1; j < nums.length; j++)",
			},
			{
				stepNumber: 3,
				title: "Check condition",
				description: "Verify if current pair meets the requirement",
				codeSnippet: "if (/* condition */) return /* result */",
			},
		],
		timeToSolve: isEasy ? 10 : isHard ? 45 : 25,
		difficulty: difficulty.toLowerCase() as "easy" | "medium" | "hard",
	};

	// Optimized Solution
	const optimized = {
		id: `optimized-${title.toLowerCase().replace(/\s+/g, "-")}`,
		approach: hasHash
			? "Hash Map - One Pass"
			: hasDP
			? "Dynamic Programming"
			: "Two Pointers",
		language: "typescript",
		code: hasHash
			? `function solve(nums: number[]): number {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    // Use hash map for O(1) lookup
    if (map.has(/* key */)) {
      return /* result */;
    }
    map.set(nums[i], i);
  }
  return -1;
}`
			: hasDP
			? `function solve(nums: number[]): number {
  const dp = new Array(nums.length).fill(0);
  dp[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
  }
  return Math.max(...dp);
}`
			: `function solve(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    // Two pointer approach
    if (/* condition */) {
      left++;
    } else {
      right--;
    }
  }
  return /* result */;
}`,
		complexity: {
			time: {
				notation: hasHash ? "O(n)" : hasDP ? "O(n)" : "O(n)",
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
				explanation: hasHash
					? "Single pass through the array with O(1) hash map operations"
					: "Single pass through the array",
			},
			space: {
				notation: hasHash ? "O(n)" : hasDP ? "O(n)" : "O(1)",
				best: hasHash ? "O(n)" : hasDP ? "O(n)" : "O(1)",
				average: hasHash ? "O(n)" : hasDP ? "O(n)" : "O(1)",
				worst: hasHash ? "O(n)" : hasDP ? "O(n)" : "O(1)",
				explanation: hasHash
					? "Hash map stores up to n elements"
					: hasDP
					? "DP array of size n"
					: "Only using constant extra space",
			},
		},
		explanation: hasHash
			? "Use a hash map to store seen elements for O(1) lookup time."
			: hasDP
			? "Dynamic programming approach builds solution incrementally."
			: "Two pointers approach reduces time complexity by eliminating unnecessary checks.",
		stepByStep: hasHash
			? [
					{
						stepNumber: 1,
						title: "Create hash map",
						description: "Store element to index mapping",
						codeSnippet: "const map = new Map<number, number>();",
					},
					{
						stepNumber: 2,
						title: "Iterate through array",
						description:
							"For each element, check if complement exists",
						codeSnippet: "if (map.has(complement)) return result;",
					},
					{
						stepNumber: 3,
						title: "Store current element",
						description: "Add current element to map",
						codeSnippet: "map.set(nums[i], i);",
					},
			  ]
			: [
					{
						stepNumber: 1,
						title: "Initialize pointers",
						description: "Set left and right pointers",
						codeSnippet:
							"let left = 0; let right = nums.length - 1;",
					},
					{
						stepNumber: 2,
						title: "Move pointers",
						description: "Adjust pointers based on condition",
						codeSnippet: "if (condition) left++; else right--;",
					},
			  ],
		timeToSolve: isEasy ? 5 : isHard ? 30 : 15,
		difficulty: difficulty.toLowerCase() as "easy" | "medium" | "hard",
	};

	// Best Practice Solution
	const bestPractice = {
		id: `best-practice-${title.toLowerCase().replace(/\s+/g, "-")}`,
		approach: "Clean Code - Industry Standard",
		language: "typescript",
		code: `function solve(nums: number[]): number {
  // Clean, readable, and maintainable solution
  const result = nums.reduce((acc, curr, index) => {
    // Functional approach with clear logic
    return /* computation */;
  }, /* initial value */);
  
  return result;
}`,
		complexity: {
			time: {
				notation: "O(n)",
				best: "O(n)",
				average: "O(n)",
				worst: "O(n)",
				explanation: "Single pass through the array",
			},
			space: {
				notation: "O(1)",
				best: "O(1)",
				average: "O(1)",
				worst: "O(1)",
				explanation: "Constant space usage",
			},
		},
		explanation:
			"Clean, readable code following industry best practices with functional programming approach.",
		stepByStep: [
			{
				stepNumber: 1,
				title: "Use functional approach",
				description: "Leverage array methods for clarity",
				codeSnippet: "nums.reduce((acc, curr) => ...)",
			},
		],
		timeToSolve: isEasy ? 8 : isHard ? 35 : 18,
		difficulty: difficulty.toLowerCase() as "easy" | "medium" | "hard",
	};

	return {
		bruteForce,
		optimized,
		bestPractice,
		alternative: [optimized], // At least one alternative
	};
}

// Helper function to generate explanations
export function generateExplanations(
	title: string,
	difficulty: string,
	topics: string[]
): any {
	return {
		overview: `${title} is a ${difficulty.toLowerCase()} problem that requires understanding of ${topics.join(
			", "
		)}. The key is to find an efficient approach that minimizes time and space complexity.`,
		approach: topics.includes("Hash Table")
			? "Use a hash map to store seen elements for O(1) lookup. This allows us to solve the problem in a single pass."
			: topics.includes("Dynamic Programming")
			? "Build the solution incrementally using dynamic programming. Store intermediate results to avoid recomputation."
			: topics.includes("Two Pointers")
			? "Use two pointers to traverse the array from both ends, eliminating unnecessary checks."
			: "Analyze the problem constraints and find the most efficient algorithm that fits the requirements.",
		stepByStep: [
			{
				step: 1,
				title: "Understand the problem",
				description:
					"Read the problem statement carefully and identify the input/output format.",
			},
			{
				step: 2,
				title: "Identify key constraints",
				description: "Note the time and space complexity requirements.",
			},
			{
				step: 3,
				title: "Choose data structure",
				description: `Select appropriate data structure: ${topics.join(
					" or "
				)}.`,
			},
			{
				step: 4,
				title: "Implement solution",
				description: "Write the code following the chosen approach.",
			},
			{
				step: 5,
				title: "Test with examples",
				description:
					"Verify the solution works with provided test cases.",
			},
		],
		keyInsights: [
			`Understanding ${topics[0]} is crucial for this problem.`,
			"Consider edge cases like empty arrays or single elements.",
			"Optimize for the most common use case.",
		],
		commonMistakes: [
			"Not handling edge cases properly",
			"Using incorrect data structure",
			"Off-by-one errors in loops",
		],
		relatedProblems: [
			{
				title: "Similar Problem 1",
				url: "https://leetcode.com/problems/similar-1/",
				difficulty: difficulty,
				similarity: 0.8,
			},
			{
				title: "Similar Problem 2",
				url: "https://leetcode.com/problems/similar-2/",
				difficulty: difficulty,
				similarity: 0.7,
			},
		],
	};
}

// Helper function to generate hints
export function generateHints(title: string, topics: string[]): any {
	return {
		progressive: [
			`Think about what data structure would help you track information efficiently.`,
			`Consider using ${
				topics[0]?.toLowerCase() || "a hash map"
			} for O(1) operations.`,
			`Try to solve it in a single pass through the array.`,
		],
		approach: topics.includes("Hash Table")
			? "Use a hash map to store and lookup elements efficiently."
			: topics.includes("Dynamic Programming")
			? "Build solution incrementally, storing results of subproblems."
			: "Consider using two pointers or sliding window technique.",
		dataStructure: topics.includes("Hash Table")
			? "Hash Map / Dictionary"
			: topics.includes("Array")
			? "Array"
			: topics.includes("Linked List")
			? "Linked List"
			: "Stack or Queue",
		algorithm: topics.includes("Dynamic Programming")
			? "Dynamic Programming"
			: topics.includes("Binary Search")
			? "Binary Search"
			: "Two Pointers or Sliding Window",
	};
}

// Generate LeetCode problems
export async function generateLeetCodeProblems(prisma: PrismaClient) {
	const problems = [];
	const baseDate = new Date();
	baseDate.setDate(baseDate.getDate() - 10); // Start from 10 days ago

	const leetcodeProblemsData = [
		{
			title: "Two Sum",
			slug: "two-sum",
			difficulty: "Easy",
			topics: ["Array", "Hash Table"],
		},
		{
			title: "Add Two Numbers",
			slug: "add-two-numbers",
			difficulty: "Medium",
			topics: ["Linked List", "Math"],
		},
		{
			title: "Longest Substring Without Repeating Characters",
			slug: "longest-substring-without-repeating-characters",
			difficulty: "Medium",
			topics: ["Hash Table", "String", "Sliding Window"],
		},
		{
			title: "Median of Two Sorted Arrays",
			slug: "median-of-two-sorted-arrays",
			difficulty: "Hard",
			topics: ["Array", "Binary Search", "Divide and Conquer"],
		},
		{
			title: "Longest Palindromic Substring",
			slug: "longest-palindromic-substring",
			difficulty: "Medium",
			topics: ["String", "Dynamic Programming"],
		},
		{
			title: "Zigzag Conversion",
			slug: "zigzag-conversion",
			difficulty: "Medium",
			topics: ["String"],
		},
		{
			title: "Reverse Integer",
			slug: "reverse-integer",
			difficulty: "Medium",
			topics: ["Math"],
		},
		{
			title: "String to Integer (atoi)",
			slug: "string-to-integer-atoi",
			difficulty: "Medium",
			topics: ["String"],
		},
		{
			title: "Palindrome Number",
			slug: "palindrome-number",
			difficulty: "Easy",
			topics: ["Math"],
		},
		{
			title: "Regular Expression Matching",
			slug: "regular-expression-matching",
			difficulty: "Hard",
			topics: ["String", "Dynamic Programming", "Recursion"],
		},
	];

	for (let i = 0; i < leetcodeProblemsData.length; i++) {
		const problemData = leetcodeProblemsData[i];
		const problemDate = new Date(baseDate);
		problemDate.setDate(baseDate.getDate() + i);

		const problem = await prisma.problem.create({
			data: {
				provider: ProviderType.LEETCODE,
				questionType: QuestionType.PROBLEM_OF_THE_DAY,
				problemId: `leetcode-${i + 1}`,
				problemSlug: problemData.slug,
				problemUrl: `https://leetcode.com/problems/${problemData.slug}/`,
				title: problemData.title,
				difficulty: problemData.difficulty,
				topics: problemData.topics,
				description: {
					raw: `<p>Given an array of integers, find the solution to the ${
						problemData.title
					} problem. This problem tests your understanding of ${problemData.topics.join(
						" and "
					)}.</p>`,
					formatted: `Given an array of integers, find the solution to the ${
						problemData.title
					} problem. This problem tests your understanding of ${problemData.topics.join(
						" and "
					)}.`,
					sections: [
						{
							type: "paragraph",
							content: `Given an array of integers, find the solution to the ${problemData.title} problem.`,
							order: 1,
						},
						{
							type: "paragraph",
							content: `This problem tests your understanding of ${problemData.topics.join(
								" and "
							)}.`,
							order: 2,
						},
					],
					wordCount: 25,
					readingTime: 1,
					hasMath: problemData.topics.includes("Math"),
					hasCode: true,
				},
				examples: [
					{
						exampleNumber: 1,
						input: "nums = [2, 7, 11, 15], target = 9",
						output: "[0, 1]",
						explanation:
							"Because nums[0] + nums[1] == 9, we return [0, 1].",
						imageUrl: null,
					},
					{
						exampleNumber: 2,
						input: "nums = [3, 2, 4], target = 6",
						output: "[1, 2]",
						explanation:
							"Because nums[1] + nums[2] == 6, we return [1, 2].",
						imageUrl: null,
					},
				],
				constraints: [
					{
						constraint: "1 <= n <= 10^4",
					},
					{
						constraint: "-10^9 <= nums[i] <= 10^9",
					},
				],
				solutions: generateSolutions(
					problemData.title,
					problemData.difficulty,
					problemData.topics
				),
				explanations: generateExplanations(
					problemData.title,
					problemData.difficulty,
					problemData.topics
				),
				hints: generateHints(problemData.title, problemData.topics),
				isPremium: i % 3 === 0, // Every 3rd problem is premium
				problemDate: problemDate,
				formattedAt: new Date(),
				aiModel: "gemini-2.0-flash",
				aiConfidence: 0.95,
				tokensUsed: 1500 + i * 100,
			},
		});

		problems.push(problem);
	}

	return problems;
}

// Generate GFG problems
export async function generateGFGProblems(prisma: PrismaClient) {
	const problems = [];
	const baseDate = new Date();
	baseDate.setDate(baseDate.getDate() - 10); // Start from 10 days ago

	const gfgProblemsData = [
		{
			title: "Maximum Subarray Sum",
			slug: "maximum-subarray-sum",
			difficulty: "Medium",
			topics: ["Array", "Dynamic Programming"],
		},
		{
			title: "Reverse a Linked List",
			slug: "reverse-a-linked-list",
			difficulty: "Easy",
			topics: ["Linked List"],
		},
		{
			title: "Binary Tree Inorder Traversal",
			slug: "binary-tree-inorder-traversal",
			difficulty: "Easy",
			topics: ["Binary Tree", "Stack"],
		},
		{
			title: "Longest Common Subsequence",
			slug: "longest-common-subsequence",
			difficulty: "Medium",
			topics: ["Dynamic Programming", "String"],
		},
		{
			title: "Merge Two Sorted Arrays",
			slug: "merge-two-sorted-arrays",
			difficulty: "Easy",
			topics: ["Array", "Two Pointers"],
		},
		{
			title: "Find Peak Element",
			slug: "find-peak-element",
			difficulty: "Medium",
			topics: ["Array", "Binary Search"],
		},
		{
			title: "Rotate Array",
			slug: "rotate-array",
			difficulty: "Medium",
			topics: ["Array"],
		},
		{
			title: "Valid Parentheses",
			slug: "valid-parentheses",
			difficulty: "Easy",
			topics: ["String", "Stack"],
		},
		{
			title: "Container With Most Water",
			slug: "container-with-most-water",
			difficulty: "Medium",
			topics: ["Array", "Two Pointers"],
		},
		{
			title: "Word Break",
			slug: "word-break",
			difficulty: "Medium",
			topics: ["Dynamic Programming", "String"],
		},
	];

	for (let i = 0; i < gfgProblemsData.length; i++) {
		const problemData = gfgProblemsData[i];
		const problemDate = new Date(baseDate);
		problemDate.setDate(baseDate.getDate() + i);

		const problem = await prisma.problem.create({
			data: {
				provider: ProviderType.GFG,
				questionType: QuestionType.PROBLEM_OF_THE_DAY,
				problemId: `gfg-${i + 1}`,
				problemSlug: problemData.slug,
				problemUrl: `https://www.geeksforgeeks.org/problems/${problemData.slug}/1`,
				title: problemData.title,
				difficulty: problemData.difficulty,
				topics: problemData.topics,
				description: {
					raw: `<p>Given an array of integers, find the solution to the ${
						problemData.title
					} problem. This problem tests your understanding of ${problemData.topics.join(
						" and "
					)}.</p>`,
					formatted: `Given an array of integers, find the solution to the ${
						problemData.title
					} problem. This problem tests your understanding of ${problemData.topics.join(
						" and "
					)}.`,
					sections: [
						{
							type: "paragraph",
							content: `Given an array of integers, find the solution to the ${problemData.title} problem.`,
							order: 1,
						},
						{
							type: "paragraph",
							content: `This problem tests your understanding of ${problemData.topics.join(
								" and "
							)}.`,
							order: 2,
						},
					],
					wordCount: 25,
					readingTime: 1,
					hasMath: problemData.topics.includes("Math"),
					hasCode: true,
				},
				examples: [
					{
						exampleNumber: 1,
						input: "nums = [2, 7, 11, 15], target = 9",
						output: "[0, 1]",
						explanation:
							"Because nums[0] + nums[1] == 9, we return [0, 1].",
						imageUrl: null,
					},
					{
						exampleNumber: 2,
						input: "nums = [3, 2, 4], target = 6",
						output: "[1, 2]",
						explanation:
							"Because nums[1] + nums[2] == 6, we return [1, 2].",
						imageUrl: null,
					},
				],
				constraints: [
					{
						constraint: "1 <= n <= 10^4",
					},
					{
						constraint: "-10^9 <= nums[i] <= 10^9",
					},
				],
				solutions: generateSolutions(
					problemData.title,
					problemData.difficulty,
					problemData.topics
				),
				explanations: generateExplanations(
					problemData.title,
					problemData.difficulty,
					problemData.topics
				),
				hints: generateHints(problemData.title, problemData.topics),
				isPremium: i % 4 === 0, // Every 4th problem is premium
				problemDate: problemDate,
				formattedAt: new Date(),
				aiModel: "gemini-2.0-flash",
				aiConfidence: 0.95,
				tokensUsed: 1500 + i * 100,
			},
		});

		problems.push(problem);
	}

	return problems;
}
