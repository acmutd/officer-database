"use server";
import { Officer, Role } from "@/schemas/officer";
import { isAdmin } from "@/lib/admin";
import { getCurrentOfficer, getOfficer } from "./officer";
import { fetchWithAuth } from "@/lib/fetch";

export async function updateUserRole({
	role,
	index,
	officerId,
}: {
	role: Role;
	index: number;
	officerId: string;
}) {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) {
		throw new Error("Current user not found");
	}
	const officer = await getOfficer(officerId);
	if (!officer) {
		throw new Error("Officer not found");
	}
	// We need to check if the current user is an admin
	if (!isAdmin(currentUser)) {
		throw new Error("Current user is not an admin");
	}

	const newRoles = [...officer.roles];
	newRoles[index] = role;

	const newLevel = await updateLevel(newRoles);
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officerId}`,
		"PATCH",
		{
			roles: newRoles,
			accessLevel: newLevel,
		}
	);
	return res;
}

export async function addUserRole({
	role,
	officerId,
}: {
	role: Role;
	officerId: string;
}) {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) {
		throw new Error("Current user not found");
	}
	const officer = await getOfficer(officerId);
	if (!officer) {
		throw new Error("Officer not found");
	}
	// We need to check if the current user is an admin
	if (!isAdmin(currentUser)) {
		throw new Error("Current user is not an admin");
	}
	const newRoles = [...officer.roles, role];
	const newLevel = await updateLevel(newRoles);
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officerId}`,
		"PATCH",
		{
			roles: newRoles,
			accessLevel: newLevel,
		}
	);
	return res;
}

// Whenever we update/add a role, we update the root level access of the Officer
// This access level should be the highest active role's level
async function updateLevel(roles: Role[]): Promise<number> {
	const activeRoles = roles.filter((role) => role.endDate === null);
	const highestLevel = Math.max(...activeRoles.map((role) => role.level));
	return highestLevel;
}
