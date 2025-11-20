import { Code, CodeXml, Home, Settings } from "lucide-react";
import { type NavItem } from "@/interface/navigation.interface";
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";

export const navItems: NavItem[] = [
	{
		label: "Home",
		href: "/dashboard",
		icon: Home,
		description: "Dashboard overview"
	},
	
	{
		label: "Providers",
		href: "/dashboard/providers",
		icon: CodeXml,
		description: "Providers",
		children: [
			{
				label: "LeetCode",
				href: "/dashboard/providers/leetcode",
				icon: SiLeetcode,
				description: "LeetCode",
			},
			{
				label: "GFG",
				href: "/dashboard/providers/gfg",
				icon: SiGeeksforgeeks,
				description: "GeekforGeeks",
			},
			// {
			// 	label: "Codeforces",
			// 	href: "/dashboard/providers/codeforces",
			// 	icon: Code,
			// 	description: "Codeforces",
			// },
			// {
			// 	label: "Codechef",
			// 	href: "/dashboard/providers/codechef",
			// 	icon: Code,
			// 	description: "Codechef",
			// },
			// {
			// 	label: "Atcoder",
			// 	href: "/dashboard/providers/atcoder",
			// 	icon: Code,
			// 	description: "Atcoder",
			// },
			// {
			// 	label: "HackerRank",
			// 	href: "/dashboard/providers/hackerrank",
			// 	icon: Code,
			// 	description: "HackerRank",
			// },
			// {
			// 	label: "HackerEarth",
			// 	href: "/dashboard/providers/hackerearth",
			// 	icon: Code,
			// 	description: "HackerEarth",
			// },
			// {
			// 	label: "KickStart",
			// 	href: "/dashboard/providers/kickstart",
			// 	icon: Code,
			// 	description: "KickStart",
			// },
			// {
			// 	label: "TopCoder",
			// 	href: "/dashboard/providers/topcoder",
			// 	icon: Code,
			// 	description: "TopCoder",
			// },
			// {
			// 	label: "Codewars",
			// 	href: "/dashboard/providers/codewars",
			// 	icon: Code,
			// 	description: "Codewars",
			// },
			// {
			// 	label: "CS Academy",
			// 	href: "/dashboard/providers/csacademy",
			// 	icon: Code,
			// 	description: "CS Academy",
			// },
		],
	},
	{
		label: "Settings",
		href: "/dashboard/setting",
		icon: Settings,
		description: "App configuration",
	},
];
