import { requireAuth } from '$lib/server/auth';
import { getFeedWithLog, toggleEpisode } from '$lib/server/db/podcasts';
import { getEpisodes } from '$lib/server/enrichment/podcast';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const user = requireAuth(event);
	const feed = await getFeedWithLog(event.params.feedId, user.id);
	if (!feed) throw error(404, 'Feed not found');

	const episodes = await getEpisodes(feed.feedUrl);
	const listenedSet = new Set(feed.podcastEpisodeLogs.map((l) => l.episodeGuid));

	return { feed, episodes, listenedSet: [...listenedSet] };
};

export const actions = {
	toggle: async (event) => {
		const user = requireAuth(event);
		const data = await event.request.formData();
		return toggleEpisode(event.params.feedId, user.id, {
			episodeGuid: data.get('guid') as string,
			title: data.get('title') as string,
			durationSeconds: Number(data.get('durationSeconds')) || undefined
		});
	}
};
