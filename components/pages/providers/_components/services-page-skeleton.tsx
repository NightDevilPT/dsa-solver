"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ViewMode } from "@/interface/theme.interface";

interface ServicesPageSkeletonProps {
	viewMode?: ViewMode;
}

export function ServicesPageSkeleton({ viewMode = "grid" }: ServicesPageSkeletonProps) {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Filters and View Toggle Skeleton */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-40" />
					<Skeleton className="h-10 w-40" />
				</div>
				<Skeleton className="h-10 w-32" />
			</div>

			{/* Services Grid or Table Skeleton */}
			{viewMode === "grid" ? (
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
			) : (
				<div className="w-full border rounded-md overflow-hidden">
					{/* Toolbar Skeleton */}
					<div className="flex items-center justify-between p-4 border-b">
						<Skeleton className="h-9 w-32" />
						<div className="flex items-center gap-2">
							<Skeleton className="h-9 w-20" />
							<Skeleton className="h-9 w-20" />
						</div>
					</div>

					{/* Table Skeleton */}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<Skeleton className="h-4 w-12" />
								</TableHead>
								<TableHead>
									<Skeleton className="h-4 w-24" />
								</TableHead>
								<TableHead>
									<Skeleton className="h-4 w-32" />
								</TableHead>
								<TableHead>
									<Skeleton className="h-4 w-28" />
								</TableHead>
								<TableHead>
									<Skeleton className="h-4 w-20" />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 10 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className="h-8 w-8 rounded" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-32" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-full" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-24" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-16" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Pagination Skeleton */}
			<div className="flex items-center justify-center gap-2">
				<Skeleton className="h-9 w-20" />
				<Skeleton className="h-9 w-20" />
				<Skeleton className="h-9 w-20" />
			</div>
		</div>
	);
}
