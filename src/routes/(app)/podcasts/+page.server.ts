import { requireAuth } from '$lib/server/auth';
import { getFeeds, followFeed, unfollowFeed } from '$lib/server/db/podcasts';
import { getFeedByUrl } from '$lib/server/enrichment/podcast';
import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = requireAuth(event);
	const activeProfileId = event.cookies.get('activeProfileId') ?? '';
	if (!activeProfileId) {
		throw redirect(303, '/settings/languages?reason=required&page=Podcasts');
	}
	return { feeds: await getFeeds(activeProfileId, user.id) };
};

export const actions = {
	follow: async (event) => {
		const user = requireAuth(event);
		const activeProfileId = event.cookies.get('activeProfileId');
		if (!activeProfileId) return fail(400, { message: 'No active profile' });

		const data = await event.request.formData();
		const feedUrl = data.get('feedUrl') as string;
		if (!feedUrl) return fail(400, { message: 'Missing feedUrl' });

		const feed = await getFeedByUrl(feedUrl);
		if (!feed) return fail(404, { message: 'Feed not found' });

		await followFeed(activeProfileId, user.id, feed);
		return { success: true };
	},

	unfollow: async (event) => {
		const user = requireAuth(event);
		const data = await event.request.formData();
		await unfollowFeed(data.get('id') as string, user.id);
		return { success: true };
	}
};
