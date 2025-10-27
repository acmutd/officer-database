import "server-only";

import { cookies } from "next/headers";
import { initializeServerApp, initializeApp } from "firebase/app";
import { cache } from "react";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

type User = {
	id: string | null;
	name: string | null;
};

export const getAuthenticatedAppForUser = cache(async () => {
	const authIdToken = (await cookies()).get("__session")?.value;

	// No token = not authenticated
	if (!authIdToken) {
		return {
			firebaseServerApp: null,
			user: { id: null, name: null },
			auth: null,
			authIdToken: null,
		};
	}

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

	return { firebaseServerApp, user, auth, authIdToken };
});
