"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const HomePageSkeleton = React.memo(function HomePageSkeleton() {
	return (
		<div className="flex flex-col w-full min-h-screen">
			{/* Hero Section Skeleton */}
			<section className="relative w-full py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
				<div className="container mx-auto max-w-6xl">
					<div className="flex flex-col items-center text-center gap-6">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-12 w-full max-w-3xl" />
						<Skeleton className="h-8 w-full max-w-2xl" />
						<Skeleton className="h-6 w-full max-w-xl" />
						<div className="flex flex-col sm:flex-row gap-4 mt-4">
							<Skeleton className="h-11 w-32" />
							<Skeleton className="h-11 w-32" />
						</div>
					</div>
				</div>
			</section>

			{/* Features Section Skeleton */}
			<section className="w-full py-20 px-4 md:px-6 lg:px-8">
				<div className="container mx-auto max-w-6xl">
					<div className="flex flex-col items-center text-center gap-4 mb-12">
						<Skeleton className="h-10 w-64" />
						<Skeleton className="h-6 w-96" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, index) => (
							<Card key={index}>
								<CardHeader>
									<Skeleton className="w-12 h-12 rounded-lg mb-4" />
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6 mt-2" />
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section Skeleton */}
			<section className="w-full py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
				<div className="container mx-auto max-w-6xl">
					<div className="flex flex-col items-center text-center gap-4 mb-12">
						<Skeleton className="h-10 w-48" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{Array.from({ length: 4 }).map((_, index) => (
							<Card key={index}>
								<CardHeader>
									<div className="flex items-start justify-between mb-4">
										<Skeleton className="w-12 h-12 rounded-lg" />
										<Skeleton className="h-5 w-8" />
									</div>
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6 mt-2" />
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section Skeleton */}
			<section className="w-full py-20 px-4 md:px-6 lg:px-8">
				<div className="container mx-auto max-w-4xl">
					<Card>
						<CardHeader className="text-center pb-4">
							<div className="flex justify-center mb-4">
								<Skeleton className="w-16 h-16 rounded-full" />
							</div>
							<Skeleton className="h-8 w-96 mx-auto mb-2" />
							<Skeleton className="h-5 w-80 mx-auto" />
						</CardHeader>
						<CardContent className="flex justify-center">
							<Skeleton className="h-11 w-48" />
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
});

HomePageSkeleton.displayName = "HomePageSkeleton";
