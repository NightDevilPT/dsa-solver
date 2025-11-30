import { ProviderType } from "@/lib/generated/prisma/enums";
import { ServiceDetailPage } from "@/components/pages/provider-details/service-detail-page";
import { ProviderServiceProvider } from "@/components/provider/provider-service-provider/provider-service-provider";

interface PageProps {
	params: Promise<{ lang: string; providerType: string; providerId: string }>;
}

export default async function ProviderServiceDetailPage({ params }: PageProps) {
	const { providerType, providerId } = await params;

	return (
		<div className="px-5">
			<ProviderServiceProvider
				providerType={providerType.toUpperCase() as ProviderType}
				providerId={providerId}
			>
				<ServiceDetailPage
					providerType={providerType.toUpperCase() as ProviderType}
					providerId={providerId}
				/>
			</ProviderServiceProvider>
		</div>
	);
}
