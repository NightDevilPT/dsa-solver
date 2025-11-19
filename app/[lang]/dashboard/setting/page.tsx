import { Suspense } from "react";
import { SettingsPage } from "@/components/pages/settings/settings-page";
import { SettingsSkeleton } from "@/components/pages/settings/_components/settings-skeleton";

export default function SettingPage() {
	return (
		<Suspense fallback={<SettingsSkeleton />}>
			<SettingsPage />
		</Suspense>
	);
}
