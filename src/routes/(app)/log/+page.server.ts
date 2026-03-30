import { requireAuth } from '$lib/server/auth';
import { listEntries, deleteEntry } from '$lib/server/db/content';
import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const user = await requireAuth(event);
	const activeProfileId = event.cookies.get('activeProfileId') ?? '';
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
