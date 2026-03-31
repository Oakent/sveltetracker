import { json, error } from '@sveltejs/kit';
import {
	searchTmdb,
	getMovieDetails,
	getShowDetails,
	getSeason
} from '$lib/server/enrichment/tmdb';
import { requireAuth } from '$lib/server/auth';

export const GET = async (event) => {
	requireAuth(event);
	const { searchParams } = event.url;
	const q = searchParams.get('q');
	const type = (searchParams.get('type') ?? 'multi') as 'movie' | 'tv' | 'multi';

	if (!q) throw error(400, 'Missing q');
	return json(await searchTmdb(q, type));
};

export const POST = async (event) => {
	requireAuth(event);
	const { tmdbId, mediaType, seasonNumber } = await event.request.json();

	if (!tmdbId) throw error(400, 'Missing tmdbId');

	if (mediaType === 'movie') return json(await getMovieDetails(tmdbId));
	if (mediaType === 'tv' && seasonNumber !== undefined)
		return json(await getSeason(tmdbId, seasonNumber));
	if (mediaType === 'tv') return json(await getShowDetails(tmdbId));

	throw error(400, 'Invalid mediaType');
};
