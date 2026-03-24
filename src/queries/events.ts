import { queryOptions } from "@tanstack/react-query";
import { getUpcomingACMEvents } from "@/functions/events";

export const getUpcomingACMEventsQuery = queryOptions({
	queryKey: ["events", "acm", "upcoming"],
	queryFn: () => getUpcomingACMEvents(4),
	staleTime: 5 * 60 * 1000,
	refetchInterval: 5 * 60 * 1000,
});
