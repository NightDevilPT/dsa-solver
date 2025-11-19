"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Bot,
	Filter,
	Code,
	Mail,
	Sparkles,
	Zap,
	Settings,
	Target,
	BookOpen,
	Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { HomeFooter } from "./_components/home-footer";
import { HomeHeader } from "./_components/home-header";
import SpotlightCard from "@/components/ui/SpotlightCard";

export const HomePage = React.memo(function HomePage() {
	const { dictionary } = useTranslation();
	const home = (dictionary as any)?.home;

	if (!home) {
		return null;
	}

	const features = [
		{
			icon: Settings,
			title: home.features?.automation?.title,
			description: home.features?.automation?.description,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			icon: Filter,
			title: home.features?.filters?.title,
			description: home.features?.filters?.description,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
		},
		{
			icon: Code,
			title: home.features?.languages?.title,
			description: home.features?.languages?.description,
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			icon: Mail,
			title: home.features?.notifications?.title,
			description: home.features?.notifications?.description,
			color: "text-orange-500",
			bgColor: "bg-orange-500/10",
		},
		{
			icon: Bot,
			title: home.features?.ai?.title,
			description: home.features?.ai?.description,
			color: "text-pink-500",
			bgColor: "bg-pink-500/10",
		},
		{
			icon: Zap,
			title: home.features?.automationTools?.title,
			description: home.features?.automationTools?.description,
			color: "text-yellow-500",
			bgColor: "bg-yellow-500/10",
		},
	];

	const steps = [
		{
			icon: Settings,
			title: home.howItWorks?.step1?.title,
			description: home.howItWorks?.step1?.description,
			step: "01",
		},
		{
			icon: BookOpen,
			title: home.howItWorks?.step2?.title,
			description: home.howItWorks?.step2?.description,
			step: "02",
		},
		{
			icon: Sparkles,
			title: home.howItWorks?.step3?.title,
			description: home.howItWorks?.step3?.description,
			step: "03",
		},
		{
			icon: Rocket,
			title: home.howItWorks?.step4?.title,
			description: home.howItWorks?.step4?.description,
			step: "04",
		},
	];

	return (
		<div className="flex flex-col w-full min-h-screen bg-background">
			{/* Header */}
			<HomeHeader />

			{/* Hero Section */}
			<section className="relative w-full py-24 md:py-32 px-4 md:px-6 lg:px-8 overflow-hidden">
				{/* Background Gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
				
				<div className="container mx-auto max-w-6xl relative z-10">
					<div className="flex flex-col items-center text-center gap-8">
						<Badge
							variant="outline"
							className="mb-2 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
						>
							<Sparkles className="h-3.5 w-3.5 mr-2" />
							AI-Powered DSA Learning
						</Badge>
						<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
							{typeof home.hero?.title === "string" ? home.hero.title : ""}
						</h1>
						<p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
							{typeof home.hero?.subtitle === "string"
								? home.hero.subtitle
								: ""}
						</p>
						<p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
							{typeof home.hero?.description === "string"
								? home.hero.description
								: ""}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 mt-6">
							<Button 
								size="lg" 
								className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
							>
								{typeof home.hero?.cta?.primary === "string"
									? home.hero.cta.primary
									: ""}
							</Button>
							<Button 
								size="lg" 
								variant="outline" 
								className="text-base px-8 h-12 border-2 hover:bg-accent/50 transition-all duration-200"
							>
								{typeof home.hero?.cta?.secondary === "string"
									? home.hero.cta.secondary
									: ""}
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="w-full py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-muted/30">
				<div className="container mx-auto max-w-7xl">
					<div className="flex flex-col items-center text-center gap-4 mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
							{typeof home.features?.title === "string"
								? home.features.title
								: ""}
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
							{typeof home.features?.subtitle === "string"
								? home.features.subtitle
								: ""}
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<SpotlightCard
									key={index}
									className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group p-6"
								>
									<div className="flex flex-col gap-4">
										<div
											className={cn(
												"w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
												feature.bgColor
											)}
										>
											<Icon className={cn("h-7 w-7", feature.color)} />
										</div>
										<div>
											<h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
												{typeof feature.title === "string"
													? feature.title
													: ""}
											</h3>
											<p className="text-base text-muted-foreground leading-relaxed">
												{typeof feature.description === "string"
													? feature.description
													: ""}
											</p>
										</div>
									</div>
								</SpotlightCard>
							);
						})}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="w-full py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-background">
				<div className="container mx-auto max-w-7xl">
					<div className="flex flex-col items-center text-center gap-4 mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
							{typeof home.howItWorks?.title === "string"
								? home.howItWorks.title
								: ""}
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
						{steps.map((step, index) => {
							const Icon = step.icon;
							return (
								<SpotlightCard
									key={index}
									className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group p-6"
								>
									<div className="flex flex-col gap-4">
										<div className="flex items-start justify-between">
											<div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
												<Icon className="h-7 w-7 text-primary" />
											</div>
											<Badge
												variant="outline"
												className="text-xs font-mono border-primary/30 bg-primary/5"
											>
												{step.step}
											</Badge>
										</div>
										<div>
											<h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
												{typeof step.title === "string" ? step.title : ""}
											</h3>
											<p className="text-base text-muted-foreground leading-relaxed">
												{typeof step.description === "string"
													? step.description
													: ""}
											</p>
										</div>
									</div>
								</SpotlightCard>
							);
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="w-full py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/30 to-background">
				<div className="container mx-auto max-w-4xl">
					<Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-2xl relative overflow-hidden">
						{/* Decorative background elements */}
						<div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
						<div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
						
						<CardHeader className="text-center pb-6 relative z-10">
							<div className="flex justify-center mb-6">
								<div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-lg">
									<Target className="h-10 w-10 text-primary" />
								</div>
							</div>
							<CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
								{typeof home.cta?.title === "string" ? home.cta.title : ""}
							</CardTitle>
							<CardDescription className="text-base md:text-lg mt-2 max-w-2xl mx-auto leading-relaxed">
								{typeof home.cta?.description === "string"
									? home.cta.description
									: ""}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex justify-center relative z-10">
							<Button 
								size="lg" 
								className="text-base px-10 h-12 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
							>
								<Rocket className="h-5 w-5 mr-2" />
								{typeof home.cta?.button === "string" ? home.cta.button : ""}
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<HomeFooter />
		</div>
	);
});

HomePage.displayName = "HomePage";

