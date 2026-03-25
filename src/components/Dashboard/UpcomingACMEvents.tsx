import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarPlus, ExternalLink, MapPin, TriangleAlert } from "lucide-react";
import { getUpcomingACMEventsQuery } from "@/queries/events";

function getGoogleCalendarUrl({
	title,
	start,
	description,
	location,
}: {
	title: string;
	start: Date;
	description?: string;
	location?: string;
}) {
	const toGoogleDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
	const end = new Date(start.getTime() + 60 * 60 * 1000);
	const details = [description || "", location ? `Location: ${location}` : ""]
		.filter(Boolean)
		.join("\n");

	return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`ACM UTD: ${title}`)}&dates=${toGoogleDate(start)}/${toGoogleDate(end)}&details=${encodeURIComponent(details)}${location ? `&location=${encodeURIComponent(location)}` : ""}`;
}

export function UpcomingACMEvents() {
	const { data: events = [], isLoading, isError } = useQuery(getUpcomingACMEventsQuery);
	const chronologicalEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

	const fullDateFormat = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});
	const timeFormat = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short",
	});

	return (
		<section className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 p-4 md:mr-auto">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="flex items-center gap-2 text-lg font-semibold text-white">
						<CalendarDays className="h-5 w-5" />
						Upcoming ACM Events
					</h2>
					<p className="mt-1 text-xs text-white/65">Displayed in chronological order.</p>
				</div>
				<a
					href="https://acmutd.co/events"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
				>
					View full calendar
					<ExternalLink className="h-3.5 w-3.5" />
				</a>
			</div>

			<div className="mt-4 space-y-3">
				{isLoading && (
					<div className="rounded-xl border border-white/10 bg-white/3 px-4 py-4 text-sm text-white/70">Loading upcoming events...</div>
				)}

				{isError && (
					<div className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
						<TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
						<span>Could not load events right now. Please check the full calendar link above.</span>
					</div>
				)}

				{!isLoading && !isError && chronologicalEvents.length === 0 && (
					<div className="rounded-xl border border-white/10 bg-white/3 px-4 py-4 text-sm text-white/70">No upcoming events at the moment. Check back soon.</div>
				)}

				{!isLoading && !isError && chronologicalEvents.length > 0 && (
					<div className="space-y-3">
						{chronologicalEvents.map((event) => (
							<div
								key={event.id}
								className="flex h-full flex-col rounded-xl border border-white/10 bg-white/3 p-3.5 transition-colors hover:bg-white/6"
							>
								<div className="min-w-0 flex-1">
										<h3 className="text-sm font-semibold text-white">{event.title}</h3>
										<p className="mt-1 text-xs text-white/70">{fullDateFormat.format(event.start)} at {timeFormat.format(event.start)}</p>

										{event.location && (
											<p className="mt-2 flex items-start gap-1.5 text-xs text-white/70">
												<MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
												<span className="line-clamp-1">{event.location}</span>
											</p>
										)}

										{event.description && <p className="mt-2 line-clamp-2 text-xs text-white/65">{event.description}</p>}
								</div>

								<div className="mt-4 pt-1">
									<a
										href={getGoogleCalendarUrl(event)}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/8 px-2.5 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/15"
									>
										<CalendarPlus className="h-3.5 w-3.5" />
										Add to Google Calendar
									</a>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
