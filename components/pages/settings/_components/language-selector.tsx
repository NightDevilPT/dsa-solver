"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";

export function LanguageSelector() {
	const { dictionary } = useTranslation();
	const settings = (dictionary as any)?.settings;

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-base font-medium">
					{settings?.language?.title || "Language & Region"}
				</h3>
				<p className="text-sm text-muted-foreground">
					{settings?.language?.description ||
						"Choose your preferred language for the application interface. This will change the text and content language throughout the application."}
				</p>
			</div>
			<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
				<div className="w-full h-auto grid grid-cols-1 gap-0 place-content-start place-items-start">
					<h3 className="text-sm font-medium">Application Language</h3>
					<span className="text-xs text-muted-foreground">
						{settings?.language?.descriptionText ||
							"Select your preferred language for menus, buttons, and interface text."}
					</span>
				</div>
				<div className="flex w-full justify-center items-center">
					<LanguageSwitcher
						variant="outline"
						size="default"
						showFlag={true}
						showText={true}
						align="end"
					/>
				</div>
			</Card>
		</div>
	);
}

