import { Officer, Role } from "@/schemas/officer";

type GetAdminLevel = Officer | Role;
export function isAdmin(account: GetAdminLevel) {
	// This will handle both Officer and Role objects
	if ("accessLevel" in account) {
		return account.accessLevel > 1;
	} else {
		return account.level > 1;
	}
}
