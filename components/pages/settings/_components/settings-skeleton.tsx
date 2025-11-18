import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SettingsSkeleton() {
	return (
		<div className="container h-full overflow-y-auto mx-auto py-4">
			<Card className="w-full bg-transparent mx-auto pt-4 border-0 shadow-none">
				<CardContent className="space-y-4">
					{/* Theme Mode Section Skeleton */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-full max-w-2xl" />
						</div>
						<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto] gap-4">
							<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-full max-w-md" />
							</div>
							<div className="flex w-full justify-center items-center">
								<Skeleton className="h-9 w-[140px] rounded-md" />
							</div>
						</Card>
					</div>

					<Separator />

					{/* Language Section Skeleton */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-full max-w-2xl" />
						</div>
						<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto] gap-4">
							<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
								<Skeleton className="h-4 w-36" />
								<Skeleton className="h-3 w-full max-w-md" />
							</div>
							<div className="flex w-full justify-center items-center">
								<Skeleton className="h-9 w-32 rounded-md" />
							</div>
						</Card>
					</div>

					<Separator />

					{/* Sidebar Configuration Section Skeleton */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-5 w-44" />
							<Skeleton className="h-4 w-full max-w-2xl" />
						</div>
						<div className="space-y-6">
							{/* Sidebar State */}
							<div className="space-y-3">
								<Skeleton className="h-4 w-28" />
								<div className="flex items-center gap-2">
									{Array.from({ length: 2 }).map((_, i) => (
										<Skeleton
											key={i}
											className="h-9 w-9 rounded-md"
										/>
									))}
								</div>
							</div>
							{/* Sidebar Variant */}
							<div className="space-y-3">
								<Skeleton className="h-4 w-32" />
								<div className="flex items-center gap-2">
									{Array.from({ length: 3 }).map((_, i) => (
										<Skeleton
											key={i}
											className="h-9 w-9 rounded-md"
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Color Palette Section Skeleton */}
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-full max-w-2xl" />
						</div>
						<Card className="border-border/50 bg-card/50 p-6 shadow-sm">
							<div className="grid grid-cols-8 max-2xl:grid-cols-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-4">
								{Array.from({ length: 8 }).map((_, i) => (
									<div
										key={i}
										className="flex flex-col items-center gap-3"
									>
										{/* Donut Chart Skeleton */}
										<Skeleton className="h-20 w-20 rounded-full" />
										<Skeleton className="h-4 w-16" />
									</div>
								))}
							</div>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


