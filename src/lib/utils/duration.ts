// Parses "1h 23m", "83m", "5400" (raw seconds), "1:23:00" into seconds
// Returns null if the input is unrecognisable
export function parseDurationInput(input: string): number | null {
	const s = input.trim();
	if (!s) return null;

	// "1h 23m", "1h", "23m", "1h23m"
	const hhmm = s.match(/^(?:(\d+)h)?\s*(?:(\d+)m)?$/i);
	if (hhmm && (hhmm[1] || hhmm[2])) {
		return Number(hhmm[1] ?? 0) * 3600 + Number(hhmm[2] ?? 0) * 60;
	}

	// "1:23:45" or "1:23"
	const colon = s.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
	if (colon) {
		if (colon[3] !== undefined) {
			return Number(colon[1]) * 3600 + Number(colon[2]) * 60 + Number(colon[3]);
		}
		return Number(colon[1]) * 60 + Number(colon[2]);
	}

	// Plain number — treat as minutes if < 1000, seconds if >= 1000
	const plain = Number(s);
	if (!isNaN(plain) && plain > 0) {
		return plain < 1000 ? plain * 60 : plain;
	}

	return null;
}

export function formatSeconds(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	if (h > 0) return s > 0 ? `${h}h ${m}m ${s}s` : `${h}h ${m}m`;
	if (m > 0) return `${m}m`;
	return `${s}s`;
}

// Converts seconds back to an editable string for the edit form pre-fill
export function secondsToDurationString(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	if (h > 0 && m > 0) return `${h}h ${m}m`;
	if (h > 0) return `${h}h`;
	return `${m}m`;
}
