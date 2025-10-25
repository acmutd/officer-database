"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { setCookie, deleteCookie } from "cookies-next";

export function AuthCookieSync() {
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// User is signed in, get the ID token and set it as a cookie
				const idToken = await user.getIdToken();
				setCookie("__session", idToken, {
					maxAge: 60 * 60 * 24 * 7, // 7 days
					path: "/",
					sameSite: "lax",
					secure: process.env.NODE_ENV === "production",
				});
			} else {
				// User is signed out, remove the cookie
				deleteCookie("__session");
			}
		});

		// Set up token refresh - Firebase tokens expire after 1 hour
		const refreshInterval = setInterval(async () => {
			const user = auth.currentUser;
			if (user) {
				const idToken = await user.getIdToken(true); // Force refresh
				setCookie("__session", idToken, {
					maxAge: 60 * 60 * 24 * 7, // 7 days
					path: "/",
					sameSite: "lax",
					secure: process.env.NODE_ENV === "production",
				});
			}
		}, 50 * 60 * 1000); // Refresh every 50 minutes (tokens expire after 60)

		return () => {
			unsubscribe();
			clearInterval(refreshInterval);
		};
	}, []);

	return null;
}
