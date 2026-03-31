import { requireAuth } from '$lib/server/auth';
import { listEntries, deleteEntry } from '$lib/server/db/content';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const user = await requireAuth(event);
	const activeProfileId = event.cookies.get('activeProfileId') ?? '';
	if (!activeProfileId) {
		throw redirect(303, '/settings/languages?reason=required&page=Content%20Log');
	}
	return { entries: await listEntries(activeProfileId, user.id) };
};

export const actions = {
	delete: async (event: RequestEvent) => {
		const user = await requireAuth(event);
		const data = await event.request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400, { message: 'Missing id' });
		await deleteEntry(id, user.id);
		return { success: true };
	}
};
