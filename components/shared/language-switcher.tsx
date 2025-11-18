"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/components/context/theme-context";
import { locales, LocaleEnum, type Locale } from "@/i18n/dictionaries";

type ButtonVariant = "default" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";
type PopoverAlign = "center" | "start" | "end";

type LanguageSwitcherProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	showFlag?: boolean;
	showText?: boolean;
	className?: string;
	align?: PopoverAlign;
	sideOffset?: number;
};

type LanguageOption = {
	label: string;
	flag?: string;
};

const LANGUAGE_OPTIONS: Record<Locale, LanguageOption> = {
	[LocaleEnum.En]: {
		label: "English",
		flag: "🇺🇸",
	},
	[LocaleEnum.Nl]: {
		label: "Nederlands",
		flag: "🇳🇱",
	},
};

const FALLBACK_LANGUAGE: Locale = LocaleEnum.En;

export function LanguageSwitcher({
	variant = "ghost",
	size = "default",
	showFlag = true,
	showText = true,
	className,
	align = "end",
	sideOffset = 5,
}: LanguageSwitcherProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { locale, setLocale } = useThemeContext();
	const [open, setOpen] = useState(false);

	const availableLocales = useMemo(() => locales, []);

	const currentLocale = availableLocales.includes(locale)
		? locale
		: FALLBACK_LANGUAGE;

	const currentLanguage = useMemo(() => {
		return (
			LANGUAGE_OPTIONS[currentLocale] ??
			LANGUAGE_OPTIONS[FALLBACK_LANGUAGE]
		);
	}, [currentLocale]);

	const buildPathForLocale = useCallback(
		(nextLocale: Locale) => {
			if (!pathname || pathname === "/") {
				return `/${nextLocale}`;
			}

			const segments = pathname.split("/").filter(Boolean);

			if (!segments.length) {
				return `/${nextLocale}`;
			}

			segments[0] = nextLocale;
			return `/${segments.join("/")}`;
		},
		[pathname]
	);

	const handleLanguageChange = useCallback(
		(nextLocale: Locale) => {
			if (nextLocale === currentLocale) {
				setOpen(false);
				return;
			}

			setLocale(nextLocale);
			const nextPath = buildPathForLocale(nextLocale);
			router.push(nextPath);
			setOpen(false);
		},
		[buildPathForLocale, currentLocale, router, setLocale]
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={variant}
					size={size}
					role="combobox"
					aria-expanded={open}
					className={cn(
						"justify-between gap-2",
						size === "icon" ? "w-10 px-0" : "px-3",
						className
					)}
				>
					<div className="flex items-center gap-2">
						{size !== "icon" && (
							<Globe className="h-4 w-4 shrink-0" />
						)}
						{showFlag && currentLanguage.flag && (
							<span className="text-base leading-none">
								{currentLanguage.flag}
							</span>
						)}
						{showText && size !== "icon" && (
							<span className="truncate text-sm font-medium">
								{currentLanguage.label}
							</span>
						)}
					</div>
					{size !== "icon" && (
						<ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[200px] p-0"
				align={align}
				sideOffset={sideOffset}
			>
				<Command>
					<CommandInput
						placeholder="Search languages..."
						className="h-9"
					/>
					<CommandList className="max-h-[280px] overflow-y-auto">
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{availableLocales.map((code) => {
								const option = LANGUAGE_OPTIONS[code] ?? {
									label: code.toUpperCase(),
								};

								return (
									<CommandItem
										key={code}
										value={`${code}-${option.label}`}
										onSelect={() =>
											handleLanguageChange(code)
										}
										className="cursor-pointer gap-2"
									>
										{option.flag && (
											<span className="text-lg">
												{option.flag}
											</span>
										)}
										<span>{option.label}</span>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												currentLocale === code
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
