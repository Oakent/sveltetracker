import { requireAuth } from '$lib/server/auth';
import { getShowWithLog, toggleEpisode } from '$lib/server/db/tv';
import { getSeason } from '$lib/server/enrichment/tmdb';
import { error, json } from '@sveltejs/kit';

export const load = async (event) => {
	const user = requireAuth(event);
	const show = await getShowWithLog(event.params.showId, user.id);
	if (!show) throw error(404, 'Show not found');

	const meta = show.showMetadata as any;
	const numberOfSeasons = meta?.numberOfSeasons ?? 1;

	// Fetch all seasons in parallel
	const seasons = await Promise.all(
		Array.from({ length: numberOfSeasons }, (_, i) => getSeason(show.externalShowId, i + 1))
	);

	const watchedSet = new Set(show.episodeLogs.map((l) => `${l.seasonNumber}-${l.episodeNumber}`));

	return { show, seasons, watchedSet: [...watchedSet] };
};

export const actions = {
	toggle: async (event) => {
		const user = requireAuth(event);
		const data = await event.request.formData();
		return toggleEpisode(event.params.showId, user.id, {
			seasonNumber: Number(data.get('seasonNumber')),
			episodeNumber: Number(data.get('episodeNumber')),
			durationSeconds: Number(data.get('durationSeconds')) || undefined
		});
	}
};
