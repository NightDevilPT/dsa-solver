"use client";

import React from "react";
import Shuffle from "../ui/Shuffle";

export const AppLoader = React.memo(function AppLoader() {
	return (
		<div className="flex items-center justify-center w-full h-screen bg-background">
			<div className="flex flex-col items-center gap-4">
				<Shuffle loop loopDelay={.5} text="L o a d i n g..." />
			</div>
		</div>
	);
});

AppLoader.displayName = "AppLoader";

