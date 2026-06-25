import { ProviderType } from "@/lib/generated/prisma/enums";

interface PageProps {
	params: Promise<{ lang: string; providerType: string }>;
}

export default async function ProviderTypePage({ params }: PageProps) {
	const { providerType } = await params;

	return (
		<div className="px-5">
			{providerType}
		</div>
	);
}
