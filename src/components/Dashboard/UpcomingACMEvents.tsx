import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarPlus, ExternalLink, MapPin, TriangleAlert } from "lucide-react";
import { getUpcomingACMEventsQuery } from "@/queries/events";

const eventAccent = ["#00c2ff", "#ffb020", "#2ad37f", "#ff6b6b"];

function getGoogleCalendarUrl({
	title,
	start,
	description,
	location,
}: {
	title: string;
	start: Date;
	description?: string;
		const shortDateFormat = new Intl.DateTimeFormat("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
		const fullDateFormat = new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
	location?: string;
}) {
			<section className="rounded-2xl border border-white/12 bg-[radial-gradient(circle_at_15%_0%,rgba(0,194,255,0.18),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(255,176,32,0.14),transparent_40%),rgba(6,10,16,0.92)] p-5 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	const details = [description || "", location ? `Location: ${location}` : ""]
						<h2 className="flex items-center gap-2 text-xl font-semibold text-white">
		.join("\n");

	return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`ACM UTD: ${title}`)}&dates=${toGoogleDate(start)}/${toGoogleDate(end)}&details=${encodeURIComponent(details)}${location ? `&location=${encodeURIComponent(location)}` : ""}`;
						<p className="mt-1 text-sm text-white/65">Live from the ACM calendar so everyone can see what is next.</p>

export function UpcomingACMEvents() {
	const { data: events = [], isLoading, isError } = useQuery(getUpcomingACMEventsQuery);

	return (
						className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/8 px-3 py-2 text-xs font-medium text-white/85 transition hover:bg-white/15"
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="flex items-center gap-2 text-lg font-semibold text-white">
						<CalendarDays className="h-5 w-5" />
						Upcoming ACM Events
					</h2>
				<div className="mt-5 grid gap-3">
				</div>
						<div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/70">Loading upcoming events...</div>
					href="https://acmutd.co/events"
					target="_blank"
					rel="noopener noreferrer"
						<div className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/12 px-4 py-4 text-sm text-rose-100">
				>
					View full calendar
					<ExternalLink className="h-3.5 w-3.5" />
				</a>
			</div>

						<div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/70">No upcoming events at the moment. Check back soon.</div>
				{isLoading && (
					<div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/70">Loading upcoming events...</div>
				)}
						const accentColor = eventAccent[index % eventAccent.length];
						const dayOfMonth = event.start.toLocaleDateString("en-US", { day: "2-digit" });
						const month = event.start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
					</div>
				)}

				{!isLoading && !isError && events.length === 0 && (
								className="group rounded-xl border border-white/12 bg-slate-950/55 px-4 py-4 transition hover:border-white/25 hover:bg-slate-900/60 sm:px-5"
								style={{ boxShadow: `inset 0 0 0 1px ${accentColor}22` }}
				)}
								<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
									<div
										className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-white/15 bg-slate-900/80"
										style={{ boxShadow: `0 0 0 1px ${accentColor}55` }}
									>
										<span className="text-[10px] font-semibold tracking-wide text-white/70">{month}</span>
										<span className="text-lg font-semibold leading-none text-white">{dayOfMonth}</span>
									</div>

									<div className="min-w-0 flex-1">
										<p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">{shortDateFormat.format(event.start)}</p>
										<h3 className="mt-1 text-lg font-semibold leading-snug text-white">{event.title}</h3>
										<p className="mt-1 text-sm text-white/70">
											{fullDateFormat.format(event.start)} at{" "}
											{event.start.toLocaleTimeString("en-US", {
												hour: "numeric",
												minute: "2-digit",
												timeZoneName: "short",
											})}
										</p>

										{event.location && (
											<p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/68">
												<MapPin className="h-3.5 w-3.5 shrink-0" />
												<span className="truncate">{event.location}</span>
											</p>
										)}

										{event.description && (
											<p className="mt-2 line-clamp-2 text-sm text-white/62">{event.description}</p>
										)}
									</div>

									<div className="sm:self-center">
										<a
											href={getGoogleCalendarUrl(event)}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/18 sm:w-auto"
										>
											<CalendarPlus className="h-3.5 w-3.5" />
											Add to Google Calendar
										</a>
									</div>
								</div>
										href={getGoogleCalendarUrl(event)}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
									>
										<CalendarPlus className="h-3.5 w-3.5" />
										Add to Google Calendar
									</a>
								</div>

								{event.description && (
									<p className="mt-3 line-clamp-2 text-xs text-white/75">{event.description}</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
