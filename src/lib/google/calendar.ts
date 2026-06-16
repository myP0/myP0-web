import { getAccessToken } from './auth';

export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	location: string;
	description: string;
	color: string;
	allDay: boolean;
	calendarId: string;
}

interface GoogleCalendarEvent {
	id: string;
	summary?: string;
	location?: string;
	description?: string;
	start: { dateTime?: string; date?: string };
	end: { dateTime?: string; date?: string };
	colorId?: string;
}

const COLOR_MAP: Record<string, string> = {
	'1': 'blue',
	'2': 'emerald',
	'3': 'violet',
	'4': 'rose',
	'5': 'amber',
	'6': 'orange',
	'7': 'cyan',
	'8': 'zinc',
	'9': 'blue',
	'10': 'emerald',
	'11': 'rose'
};

const FALLBACK_COLORS = ['blue', 'emerald', 'violet', 'amber', 'rose', 'cyan', 'orange'];

export async function fetchCalendarEvents(
	date: Date,
	daysToFetch: number = 1
): Promise<CalendarEvent[]> {
	const token = getAccessToken();
	if (!token) return [];

	const timeMin = new Date(date);
	timeMin.setHours(0, 0, 0, 0);

	const timeMax = new Date(timeMin);
	timeMax.setDate(timeMax.getDate() + daysToFetch);

	const params = new URLSearchParams({
		timeMin: timeMin.toISOString(),
		timeMax: timeMax.toISOString(),
		singleEvents: 'true',
		orderBy: 'startTime',
		maxResults: '100'
	});

	try {
		const res = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		if (!res.ok) {
			console.error('Calendar API error:', res.status, await res.text());
			return [];
		}

		const data = await res.json();
		const events: GoogleCalendarEvent[] = data.items || [];

		return events.map((event, i) => {
			const isAllDay = !event.start.dateTime;
			const start = new Date(event.start.dateTime || event.start.date || '');
			const end = new Date(event.end.dateTime || event.end.date || '');

			return {
				id: event.id,
				title: event.summary || '(No title)',
				start,
				end,
				location: event.location || '',
				description: event.description || '',
				color: event.colorId
					? COLOR_MAP[event.colorId] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
					: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
				allDay: isAllDay,
				calendarId: 'primary'
			};
		});
	} catch (err) {
		console.error('Failed to fetch calendar events:', err);
		return [];
	}
}

export async function fetchWeekEvents(date: Date): Promise<CalendarEvent[]> {
	const startOfWeek = new Date(date);
	const day = startOfWeek.getDay();
	startOfWeek.setDate(startOfWeek.getDate() - day);
	return fetchCalendarEvents(startOfWeek, 7);
}
