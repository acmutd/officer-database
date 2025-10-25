import "server-only";

import { cookies } from "next/headers";
import { initializeServerApp, initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";
import { Officer } from "@/schemas/officer";
import { getOrCreateOfficer } from "@/functions/officer";

type User = {
	id: string | null;
	name: string | null;
};

export async function getAuthenticatedAppForUser() {
	const authIdToken = (await cookies()).get("__session")?.value;

	// Firebase Server App is a new feature in the JS SDK that allows you to
	// instantiate the SDK with credentials retrieved from the client & has
	// other affordances for use in server environments.
	const firebaseServerApp = initializeServerApp(
		// https://github.com/firebase/firebase-js-sdk/issues/8863#issuecomment-2751401913
		initializeApp(firebaseConfig),
		{
			authIdToken,
		}
	);

	const auth = getAuth(firebaseServerApp);
	await auth.authStateReady();

	if (!auth.currentUser) {
		return {
			firebaseServerApp,
			user: { id: null, name: null },
			auth,
			authIdToken,
		};
	}

	const user: User = {
		id: auth.currentUser.uid,
		name: auth.currentUser.displayName!,
	};

	// Ensure officer account exists in the database
	// Pass auth params directly to avoid circular dependency
	if (user.id && user.name && authIdToken) {
		await getOrCreateOfficer(user.id, user.name, {
			authIdToken,
			userId: user.id,
		});
	}

	return { firebaseServerApp, user, auth, authIdToken };
}
