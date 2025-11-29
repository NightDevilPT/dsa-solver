"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ServicesPageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Services Grid Skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<Card key={index}>
						<CardHeader>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-2">
										<Skeleton className="h-6 w-32" />
										<Skeleton className="h-5 w-20" />
									</div>
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
								<Skeleton className="h-12 w-12 rounded" />
							</div>
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-24" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Pagination Skeleton */}
			<div className="flex items-center justify-center gap-2">
				<Skeleton className="h-9 w-20" />
				<Skeleton className="h-9 w-20" />
				<Skeleton className="h-9 w-20" />
			</div>
		</div>
	);
}
