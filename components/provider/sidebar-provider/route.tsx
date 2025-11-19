import { Home, Settings } from "lucide-react";
import { type NavItem } from "@/interface/navigation.interface";

export const navItems: NavItem[] = [
	{
		label: "Home",
		href: "/",
		icon: Home,
		description: "Dashboard overview",
		children: [
			{
				label: "Overview",
				href: "/overview",
				icon: Home,
				description: "Dashboard overview",
			},
			{
				label: "Analytics",
				href: "/analytics",
				icon: Home,
				description: "Analytics",
			},
		],
	},
	{
		label: "Settings",
		href: "/setting",
		icon: Settings,
		description: "App configuration",
	},
];
