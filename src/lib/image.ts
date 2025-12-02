import type { Photo } from "@/schemas/officer";

export const getOfficerImageUrl = (photo: Photo, cache?: boolean) => {
	return `${photo.url}${cache && photo.lastUpdatedAt ? `?v=${photo.lastUpdatedAt}` : ""}`;
};
