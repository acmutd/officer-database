import { OfficerSchema, type Role } from "@/schemas/officer";
import { getCurrentOfficer, getOfficerById } from "./officer";
import { fetchWithAuth } from "./fetch";
import { isAdmin } from "@/lib/admin";

export const updateOfficerRole = async ({
	officerId,
	role,
	index,
}: {
	officerId: string;
	role: Role;
	index: number;
}) => {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) throw new Error("Current user not found");
	if (!isAdmin(currentUser)) throw new Error("Unauthorized");

	const officer = await getOfficerById(officerId);
	if (!officer) throw new Error("Officer not found");
	const newRoles = [...officer.roles];
	newRoles[index] = role;
	const newLevel = updateLevel(newRoles);
	const res = await fetchWithAuth(`/updateOfficer?id=${officerId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ roles: newRoles, accessLevel: newLevel }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
};

export const addOfficerRole = async ({
	officerId,
	role,
}: {
	officerId: string;
	role: Role;
}) => {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) throw new Error("Current user not found");
	if (!isAdmin(currentUser)) throw new Error("Unauthorized");

	const officer = await getOfficerById(officerId);
	if (!officer) throw new Error("Officer not found");
	const newRoles = [...officer.roles, role];
	const newLevel = updateLevel(newRoles);
	const res = await fetchWithAuth(`/updateOfficer?id=${officerId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ roles: newRoles, accessLevel: newLevel }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
};

// Whenever we update/add a role, we update the root level access of the Officer
// This access level should be the highest active role's level
function updateLevel(roles: Role[]): number {
	const activeRoles = roles.filter((role) => role.endDate === null);
	const highestLevel = Math.max(...activeRoles.map((role) => role.level));
	return highestLevel;
}
