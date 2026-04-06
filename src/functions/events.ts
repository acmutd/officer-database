export type ACMEvent = {
	id: string;
	title: string;
	start: Date;
	location?: string;
	description?: string;
};

type ACMEventResponseItem = {
	id?: string;
	title?: string;
	start?: string;
	location?: string;
	description?: string;
};

type ACMEventResponse = {
	events?: ACMEventResponseItem[];
	error?: string;
};

const ACM_EVENTS_API_BASE = "https://acmutd.co";

export async function getUpcomingACMEvents(limit = 4): Promise<ACMEvent[]> {
	const timeMin = new Date().toISOString();
	const response = await fetch(`${ACM_EVENTS_API_BASE}/api/events?timeMin=${encodeURIComponent(timeMin)}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch ACM events: ${response.status} ${response.statusText}`);
	}

	const data = (await response.json()) as ACMEventResponse;
	if (data.error) {
		throw new Error(data.error);
	}

	const parsed = (data.events ?? [])
		.filter((event): event is Required<Pick<ACMEventResponseItem, "id" | "title" | "start">> & ACMEventResponseItem =>
			Boolean(event.id && event.title && event.start)
		)
		.map((event) => ({
			id: event.id,
			title: event.title,
			start: new Date(event.start),
			location: event.location,
			description: event.description,
		}))
		.filter((event) => !Number.isNaN(event.start.getTime()))
		.sort((a, b) => a.start.getTime() - b.start.getTime())
		.slice(0, limit);

	return parsed;
}
