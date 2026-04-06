import {
	getAllOfficers,
	getCurrentOfficer,
	getOfficerById,
	archiveOfficer,
	unarchiveOfficer,
	updateAcademicInfo,
	updateOfficerImage,
	updateOfficerName,
	updateOfficerStatus,
} from "@/functions/officer";
import { mutationOptions, queryOptions, type QueryClient } from "@tanstack/react-query";
import type { Officer } from "@/schemas/officer";

const OFFICER_STALE_TIME_MS = 2 * 60 * 1000;
const OFFICER_LIST_STALE_TIME_MS = 60 * 1000;

export const getOfficerQuery = queryOptions({
	queryKey: ["officer", "current"],
	queryFn: getCurrentOfficer,
	staleTime: OFFICER_STALE_TIME_MS,
});

export const getOfficerByIdQuery = (officerId: string, archived = false) =>
	queryOptions({
		queryKey: ["officer", officerId, archived ? "archived" : "current"],
		queryFn: () => getOfficerById(officerId, archived),
		staleTime: OFFICER_STALE_TIME_MS,
	});
const officersQuery = (archived: boolean) =>
	queryOptions({
		queryKey: ["officers", archived ? "archived" : "current"],
		queryFn: () => getAllOfficers({ archived }),
		staleTime: OFFICER_LIST_STALE_TIME_MS,
	});

export const getCurrentOfficersQuery = officersQuery(false);
export const getPastOfficersQuery = officersQuery(true);

function mergeOfficerPatch(current: Officer, patch: Partial<Officer>): Officer {
	return {
		...current,
		...patch,
		socialLinks: patch.socialLinks
			? { ...current.socialLinks, ...patch.socialLinks }
			: current.socialLinks,
		photo: patch.photo ? { ...current.photo, ...patch.photo } : current.photo,
	};
}

export function patchOfficerCache(
	client: QueryClient,
	officerId: string,
	patch: Partial<Officer>
) {
	const applyPatch = (officer: Officer) =>
		officer.id === officerId ? mergeOfficerPatch(officer, patch) : officer;

	client.setQueryData<Officer | null>(getOfficerQuery.queryKey, (current) =>
		current ? applyPatch(current) : current
	);

	client.setQueryData<Officer | null>(
		getOfficerByIdQuery(officerId, false).queryKey,
		(current) => (current ? applyPatch(current) : current)
	);

	client.setQueryData<Officer | null>(
		getOfficerByIdQuery(officerId, true).queryKey,
		(current) => (current ? applyPatch(current) : current)
	);

	client.setQueryData<Officer[] | undefined>(getCurrentOfficersQuery.queryKey, (list) =>
		list?.map(applyPatch)
	);

	client.setQueryData<Officer[] | undefined>(getPastOfficersQuery.queryKey, (list) =>
		list?.map(applyPatch)
	);
}

export function syncOfficerCache(client: QueryClient, officer: Officer) {
	patchOfficerCache(client, officer.id, officer);
}

export const updateOfficerImageMutation = mutationOptions({
	mutationFn: updateOfficerImage,
	onSuccess: (imagePayload, variables, ___, context) => {
		if (typeof imagePayload === "string") {
			patchOfficerCache(context.client, variables.officerId, {
				photo: {
					url: imagePayload,
					lastUpdatedAt: new Date().toISOString(),
				},
			});
			return;
		}

		if (imagePayload && typeof imagePayload === "object") {
			const data = imagePayload as { url?: string; lastUpdatedAt?: string };
			if (data.url || data.lastUpdatedAt) {
				const photoPatch: Officer["photo"] = {
					lastUpdatedAt: data.lastUpdatedAt ?? new Date().toISOString(),
				};
				if (data.url) {
					photoPatch.url = data.url;
				}
				patchOfficerCache(context.client, variables.officerId, {
					photo: photoPatch,
				});
				return;
			}
		}

		context.client.invalidateQueries(getOfficerByIdQuery(variables.officerId, false));
		context.client.invalidateQueries(getOfficerByIdQuery(variables.officerId, true));
	},
});

export const updateOfficerNameMutation = mutationOptions({
	mutationFn: updateOfficerName,
	onSuccess: (res, _, __, context) => {
		syncOfficerCache(context.client, res);
	},
});

export const updateAcademicInfoMutationOptions = mutationOptions({
	mutationFn: updateAcademicInfo,
	onSuccess: (res, _, __, context) => {
		syncOfficerCache(context.client, res);
	},
});

export const updateOfficerStatusMutation = mutationOptions({
	mutationFn: updateOfficerStatus,
	onSuccess: (res, _variables, __, context) => {
		syncOfficerCache(context.client, res);
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});

export const archiveOfficerMutation = mutationOptions({
	mutationFn: archiveOfficer,
	onSuccess: (res, _officerId: string, __, context) => {
		syncOfficerCache(context.client, res);
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});

export const unarchiveOfficerMutation = mutationOptions({
	mutationFn: unarchiveOfficer,
	onSuccess: (res, _officerId: string, __, context) => {
		syncOfficerCache(context.client, res);
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});
