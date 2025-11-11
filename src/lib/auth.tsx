import * as React from "react";

import {
	onAuthStateChanged,
	type User,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { flushSync } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { auth, googleProvider } from "./firebase";
import { getOrCreateOfficer } from "@/functions/officer";
import { getOfficerQuery } from "@/queries/officer";

export type AuthContextType = {
	isAuthenticated: boolean;
	isInitialLoading: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	user: User | null;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = React.useState<User | null>(auth.currentUser);
	const [isInitialLoading, setIsInitialLoading] = React.useState(true);
	const isAuthenticated = !!user;
	const queryClient = useQueryClient();

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			flushSync(() => {
				setUser(user);
				setIsInitialLoading(false);
			});

			if (user) {
				queryClient.prefetchQuery(getOfficerQuery);
			} else {
				queryClient.removeQueries(getOfficerQuery);
			}
		});
		return () => unsubscribe();
	}, [queryClient]);

	const logout = React.useCallback(async () => {
		console.log("Logging out...");
		await signOut(auth);
		setUser(null);
		setIsInitialLoading(false);
		queryClient.clear();
	}, [queryClient]);

	const login = React.useCallback(async () => {
		const result = await signInWithPopup(auth, googleProvider);

		await getOrCreateOfficer();

		flushSync(() => {
			setUser(result.user);
			setIsInitialLoading(false);
		});

		await queryClient.prefetchQuery(getOfficerQuery);
	}, [queryClient]);

	return (
		<AuthContext.Provider
			value={{ isInitialLoading, isAuthenticated, user, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
