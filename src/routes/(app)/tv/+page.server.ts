import { requireAuth } from '$lib/server/auth';
import { getLibrary, addShow, removeShow } from '$lib/server/db/tv';
import { getShowDetails } from '$lib/server/enrichment/tmdb';
import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = requireAuth(event);
	const activeProfileId = event.cookies.get('activeProfileId') ?? '';
	if (!activeProfileId) {
		throw redirect(303, '/settings/languages?reason=required&page=TV%20Shows');
	}
	return { shows: await getLibrary(activeProfileId, user.id) };
};

export const actions = {
	add: async (event) => {
		const user = requireAuth(event);
		const activeProfileId = event.cookies.get('activeProfileId');
		if (!activeProfileId) return fail(400, { message: 'No active profile' });

		const data = await event.request.formData();
		const tmdbId = data.get('tmdbId') as string;
		if (!tmdbId) return fail(400, { message: 'Missing tmdbId' });

		const details = await getShowDetails(tmdbId);
		await addShow(activeProfileId, user.id, details);
		return { success: true };
	},

	remove: async (event) => {
		const user = requireAuth(event);
		const data = await event.request.formData();
		const id = data.get('id') as string;
		await removeShow(id, user.id);
		return { success: true };
	}
};
