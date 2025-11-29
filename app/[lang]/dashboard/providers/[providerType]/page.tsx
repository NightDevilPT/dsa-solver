import { ProviderType } from "@/lib/generated/prisma/enums";
import { ServicesPage } from "@/components/pages/providers/services-page";

interface PageProps {
	params: Promise<{ lang: string; providerType: string }>;
}

export default async function ProviderTypePage({ params }: PageProps) {
	const { providerType } = await params;

	return (
		<div className="px-5">
			<ServicesPage
				providerType={providerType.toUpperCase() as ProviderType}
			/>
		</div>
	);
}
