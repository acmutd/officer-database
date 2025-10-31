import "server-only";

import { cookies } from "next/headers";
import { initializeServerApp, initializeApp } from "firebase/app";
import { cache } from "react";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";
import { Officer, OfficerSchema } from "@/schemas/officer";

type User = {
	id: string;
	name: string;
	officer: Officer | null;
};

export const getAuthenticatedAppForUser = cache(async () => {
	const authIdToken = (await cookies()).get("__session")?.value;

	// No token = not authenticated
	if (!authIdToken) {
		return {
			firebaseServerApp: null,
			user: null,
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
			user: null,
			auth,
			authIdToken,
		};
	}

	const userId = auth.currentUser.uid;
	const userName = auth.currentUser.displayName!;

	// Get or create officer - authentication succeeds even if this fails
	const officer = await getOrCreateOfficerInternal(
		userId,
		userName,
		authIdToken
	);

	const user: User = {
		id: userId,
		name: userName,
		officer: officer || null,
	};

	return { firebaseServerApp, user, auth, authIdToken };
});

// Internal function to get or create officer without circular dependency
async function getOrCreateOfficerInternal(
	userId: string,
	name: string,
	authIdToken: string
): Promise<Officer | null> {
	try {
		// Try to get existing officer
		const existingOfficer = await fetchOfficerInternal(userId, authIdToken);
		if (existingOfficer) {
			return existingOfficer;
		}

		// Create new officer if doesn't exist
		const [firstName, lastName] = name.split(" ");
		const newOfficer: Officer = {
			id: userId,
			firstName: firstName,
			lastName: lastName,
			netId: "xxxxxx",
			socialLinks: {},
			creditStanding: "Freshman",
			yearStanding: "Freshman",
			expectedGrad: {
				year: new Date().getFullYear() + 4,
				term: "Fall",
			},
			internships: [],
			research: [],
			accessLevel: 1,
			isActive: true,
			joinDate: {
				term: "Fall",
				year: new Date().getFullYear(),
			},
			roles: [],
		};

		const res = await fetch(`${process.env.API_URL}/officers`, {
			method: "POST",
			body: JSON.stringify(newOfficer),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authIdToken}`,
				"X-User-Id": userId,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("Failed to create officer:", await res.text());
			return null;
		}

		const createdOfficer = await res.json();
		return OfficerSchema.parse(createdOfficer);
	} catch (error) {
		console.error("Failed to get or create officer:", error);
		return null;
	}
}

async function fetchOfficerInternal(
	userId: string,
	authIdToken: string
): Promise<Officer | null> {
	try {
		const res = await fetch(`${process.env.API_URL}/officers/${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authIdToken}`,
				"X-User-Id": userId,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			return null;
		}

		const officer = await res.json();
		return OfficerSchema.parse(officer);
	} catch (error) {
		return null;
	}
}
