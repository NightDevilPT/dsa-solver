"use client";

import { UserSessionContextProvider } from "@/components/context/user-session-context";

export interface UserSessionProviderProps {
	children: React.ReactNode;
}

export const UserSessionProvider = ({ children }: UserSessionProviderProps) => {
	return <UserSessionContextProvider>{children}</UserSessionContextProvider>;
};
