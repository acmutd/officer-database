import type { Photo } from "@/schemas/officer";

export const getOfficerImageUrl = (photo: Photo) => {
	return photo.url + (photo.lastUpdatedAt ? `?v=${photo.lastUpdatedAt}` : "");
};
