"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { getOrCreateOfficer } from "@/functions/officer";
import { Officer } from "@/schemas/officer";
import { getCurrentOfficerQueryOptions } from "@/queries/officer";

const authFunctions = {
	signIn: () => signInWithPopup(auth, googleProvider),
	signOut: () => signOut(auth),
};

export function useAuth() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { data: user, isLoading } = useQuery({
		queryKey: ["auth", "user"],
		queryFn: () => {
			return new Promise<User | null>((resolve) => {
				const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
					unsubscribe();
					resolve(user);
				});
			});
		},
		staleTime: 5 * 60 * 1000,
	});

	const {
		data: officer,
		isLoading: isLoadingOfficer,
		error: officerError,
	} = useQuery<Officer | null>({
		queryKey: ["officer", user?.uid],
		queryFn: async () => {
			if (!user?.uid || !user?.displayName) {
				return null;
			}
			return await getOrCreateOfficer(user.uid, user.displayName);
		},
		enabled: !!user?.uid && !!user?.displayName,
		staleTime: 5 * 60 * 1000,
	});

	const signInMutation = useMutation({
		mutationFn: async () => {
			const credentials = await authFunctions.signIn();
			const userId = credentials.user.uid;
			const name = credentials.user.displayName;
			if (!userId || !name) {
				throw new Error("Failed to get user ID or name");
			}
			const officer = await getOrCreateOfficer(userId, name);
			return [credentials, officer] as const;
		},
		onSuccess: ([credentials, officer]) => {
			queryClient.setQueryData(["auth", "user"], credentials.user);
			queryClient.setQueryData(getCurrentOfficerQueryOptions.queryKey, officer);
			router.push("/");
		},
	});

	const signOutMutation = useMutation({
		mutationFn: authFunctions.signOut,
		onSuccess: () => {
			queryClient.setQueryData(["auth", "user"], null);
			queryClient.removeQueries(getCurrentOfficerQueryOptions);
			queryClient.clear();
			router.push("/login");
		},
	});

	return {
		user,
		officer,
		isLoading: isLoading || (!!user && isLoadingOfficer),
		officerError,
		signIn: signInMutation.mutateAsync,
		signOut: signOutMutation.mutateAsync,
		isSigningIn: signInMutation.isPending,
		isSigningOut: signOutMutation.isPending,
	};
}
