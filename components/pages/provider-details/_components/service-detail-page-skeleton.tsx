"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ServiceDetailPageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Tabs Skeleton */}
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview" disabled>
						<Skeleton className="h-4 w-20" />
					</TabsTrigger>
					<TabsTrigger value="notifications" disabled>
						<Skeleton className="h-4 w-24" />
					</TabsTrigger>
					<TabsTrigger value="config" disabled>
						<Skeleton className="h-4 w-16" />
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab Skeleton */}
				<TabsContent value="overview" className="mt-4">
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-48" />
							</CardHeader>
							<CardContent className="space-y-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-32" />
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{Array.from({ length: 4 }).map((_, i) => (
										<Skeleton
											key={i}
											className="h-8 w-24"
										/>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Notifications Tab Skeleton */}
				<TabsContent value="notifications" className="mt-4">
					<div className="space-y-6">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-6 w-48" />
								</CardHeader>
								<CardContent className="space-y-4">
									{Array.from({ length: 3 }).map((_, j) => (
										<div
											key={j}
											className="flex items-center justify-between"
										>
											<div className="space-y-2 flex-1">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-3 w-48" />
											</div>
											<Skeleton className="h-6 w-12" />
										</div>
									))}
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Config Tab Skeleton */}
				<TabsContent value="config" className="mt-4">
					<div className="space-y-6">
						{Array.from({ length: 3 }).map((_, i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-6 w-48" />
								</CardHeader>
								<CardContent className="space-y-4">
									{Array.from({ length: 2 }).map((_, j) => (
										<div key={j} className="space-y-2">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-10 w-full" />
										</div>
									))}
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
