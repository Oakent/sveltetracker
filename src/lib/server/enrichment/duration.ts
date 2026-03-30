export const minutesToSeconds = (m: number) => Math.round(m * 60);

export const isoToSeconds = (iso: string): number => {
	const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!m) return 0;
	return +(m[1] ?? 0) * 3600 + +(m[2] ?? 0) * 60 + +(m[3] ?? 0);
};
