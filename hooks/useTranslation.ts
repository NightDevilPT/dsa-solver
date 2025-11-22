"use client";

import { useEffect, useState, useMemo } from "react";
import { Dictionary, getDictionary, locales } from "@/i18n/dictionaries";
import { useThemeContext } from "@/components/context/theme-context";

/**
 * Safely accesses a nested dictionary path and returns a string value.
 * @param dict - The dictionary object to search
 * @param path - Dot-separated path (e.g., "home.hero.title")
 * @returns The string value at the path, or empty string if not found
 */
const getNestedValue = (dict: Dictionary, path: string): string => {
	const keys = path.split(".");
	let current: unknown = dict;

	for (const key of keys) {
		if (
			current &&
			typeof current === "object" &&
			key in current &&
			(current as Dictionary)[key] !== undefined
		) {
			current = (current as Dictionary)[key];
		} else {
			return "";
		}
	}

	return typeof current === "string" ? current : "";
};

export const useTranslation = () => {
	const { locale } = useThemeContext();
	const fallbackLocale = locales[0];

	const [dictionary, setDictionary] = useState<Dictionary>({});

	useEffect(() => {
		let isMounted = true;

		const loadDictionary = async () => {
			const resolvedLocale = locale ?? fallbackLocale;

			try {
				const result = await getDictionary(resolvedLocale);
				if (isMounted) {
					setDictionary(result ?? {});
				}
			} catch (error) {
				if (isMounted) {
					setDictionary({});
				}
				console.error("Failed to load dictionary", error);
			}
		};

		loadDictionary();

		return () => {
			isMounted = false;
		};
	}, [locale, fallbackLocale]);

	/**
	 * Translation function that safely accesses nested dictionary paths.
	 * @param path - Dot-separated path to the translation key (e.g., "home.hero.title")
	 * @returns The translated string or empty string if not found
	 * @example
	 * const { t } = useTranslation();
	 * <h1>{t("home.hero.title")}</h1>
	 */
	const t = useMemo(
		() => (path: string): string => {
			return getNestedValue(dictionary, path);
		},
		[dictionary]
	);

	return { dictionary, t };
};
