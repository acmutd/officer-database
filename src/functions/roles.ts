"use server";
import { Role } from "@/schemas/officer";
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
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officerId}`,
		"PATCH",
		{
			roles: newRoles,
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
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officerId}`,
		"PATCH",
		{
			roles: newRoles,
		}
	);
	return res;
}
