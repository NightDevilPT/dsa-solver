"use client";

import { useEffect, useState } from "react";
import { Dictionary, getDictionary, locales } from "@/i18n/dictionaries";
import { useThemeContext } from "@/components/context/theme-context";

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

	return { dictionary };
};
