import type { Metadata } from "next";
import { Locale } from "@/i18n/dictionaries";
import { getDictionary } from "@/i18n/dictionaries";

type Props = {
	children: React.ReactNode;
	params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;
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
	const { lang } = await params;

	return children;
}
