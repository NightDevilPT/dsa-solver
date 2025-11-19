import type { Metadata } from "next";
import { Locale, locales, getDictionary } from "@/i18n/dictionaries";

type Props = {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang: langParam } = await params;
	const lang = (
		locales.includes(langParam as Locale) ? langParam : locales[0]
	) as Locale;
	const dictionary = await getDictionary(lang);
	const settings = (dictionary as any)?.settings;

	return {
		title: settings?.title || "Settings",
		description:
			settings?.description ||
			"Customize your application appearance and preferences",
	};
}

export default async function SettingLayout({ children, params }: Props) {
	const { lang: langParam } = await params;
	const lang = (
		locales.includes(langParam as Locale) ? langParam : locales[0]
	) as Locale;

	return children;
}
