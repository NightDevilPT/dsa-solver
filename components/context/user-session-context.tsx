"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import apiService from "@/lib/api-service/api.service";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter, usePathname } from "next/navigation";
import { LoginForm } from "@/components/shared/login-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// User session data type
export interface UserSession {
	id: string;
	email: string;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	avatar: string | null;
	emailVerified: boolean;
	emailVerifiedAt: Date | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Context value type
export interface UserSessionContextValue {
	user: UserSession | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	isAuthenticated: boolean;
	showLoginModal: boolean;
	setShowLoginModal: (show: boolean) => void;
}

// Context
const UserSessionContext = createContext<UserSessionContextValue | undefined>(
	undefined
);

// Provider props
export interface UserSessionContextProviderProps {
	children: React.ReactNode;
}

// Provider component
export const UserSessionContextProvider = ({
	children,
}: UserSessionContextProviderProps) => {
	const [user, setUser] = useState<UserSession | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
	const router = useRouter();
	const pathname = usePathname();
	const { t } = useTranslation();

	// Fetch user session
	const fetchSession = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await apiService.get<UserSession>(
				"/api/protected/auth/session"
			);

			// Handle errors - show login modal (skip on auth pages)
			if (result.statusCode >= 400 || !result.success) {
				setUser(null);
				setError(result.message || "Session expired");
				// Don't show modal on auth pages
				if (!pathname?.includes("/auth/")) {
					setShowLoginModal(true);
				}
				setIsLoading(false);
				return;
			}

			// Success - set user data
			if (result.data) {
				setUser(result.data);
				setError(null);
			} else {
				setUser(null);
				setError("No user data received");
			}
		} catch (err) {
			console.error("Session fetch error:", err);
			setError("Failed to fetch session");
			setUser(null);
			// Don't show modal on auth pages
			if (!pathname?.includes("/auth/")) {
				setShowLoginModal(true);
			}
		} finally {
			setIsLoading(false);
		}
	}, [pathname]);

	// Fetch session on mount (skip on auth pages to avoid redirect loops)
	useEffect(() => {
		// Don't fetch session on auth pages
		if (pathname?.includes("/auth/")) {
			setIsLoading(false);
			return;
		}

		fetchSession();
	}, [fetchSession, pathname]);

	// Handle successful login
	const handleLoginSuccess = useCallback(() => {
		setShowLoginModal(false);
		fetchSession();
		router.refresh();
	}, [fetchSession, router]);

	// Memoized context value
	const value = useMemo<UserSessionContextValue>(
		() => ({
			user,
			isLoading,
			error,
			refetch: fetchSession,
			isAuthenticated: !!user,
			showLoginModal,
			setShowLoginModal,
		}),
		[user, isLoading, error, fetchSession, showLoginModal]
	);

	return (
		<UserSessionContext.Provider value={value}>
			{children}
			<Dialog
				open={showLoginModal}
				onOpenChange={() => {
					// Prevent closing modal - it will only close after successful login
					// The modal is controlled by handleLoginSuccess callback
				}}
			>
				<DialogContent
					showCloseButton={false}
					onInteractOutside={(e) => {
						// Prevent closing on outside click
						e.preventDefault();
					}}
					onEscapeKeyDown={(e) => {
						// Prevent closing on escape key
						e.preventDefault();
					}}
				>
					<LoginForm onSuccess={handleLoginSuccess} />
				</DialogContent>
			</Dialog>
		</UserSessionContext.Provider>
	);
};

// Custom hook
export const useUserSession = (): UserSessionContextValue => {
	const context = useContext(UserSessionContext);

	if (!context) {
		throw new Error(
			"useUserSession must be used within a UserSessionContextProvider"
		);
	}

	return context;
};
