import { json, error } from '@sveltejs/kit';
import { enrichYouTube } from '$lib/server/enrichment/youtube';
import { requireAuth } from '$lib/server/auth';

export const POST = async (event) => {
	requireAuth(event);
	const { url } = await event.request.json();
	try {
		return json(await enrichYouTube(url));
	} catch (e) {
		throw error(400, (e as Error).message);
	}
};
