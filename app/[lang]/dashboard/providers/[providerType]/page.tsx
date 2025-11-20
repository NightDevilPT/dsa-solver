interface PageProps {
	params: Promise<{ lang: string; providerType: string }>;
}

export default async function ProviderTypePage({ params }: PageProps) {
	const { providerType, lang } = await params;
	
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Provider Type</h1>
			<p className="text-muted-foreground">
				Provider Type: <span className="font-semibold">{providerType}</span>
			</p>
			<p className="text-muted-foreground">
				Language: <span className="font-semibold">{lang}</span>
			</p>
		</div>
	);
}