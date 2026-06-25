import { ProviderType } from "@/lib/generated/prisma/enums";

interface PageProps {
	params: Promise<{ lang: string; providerType: string; providerId: string }>;
}

export default async function ProviderServiceDetailPage({ params }: PageProps) {
	const { providerType, providerId } = await params;

	return (
		<div className="px-5">
			{providerId}
			{providerType}
		</div>
	);
}
