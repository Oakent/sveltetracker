import { requireAuth } from '$lib/server/auth';
import { getEntry, updateEntry } from '$lib/server/db/content';
import { fail, redirect, error } from '@sveltejs/kit';
import type { ContentType } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const user = await requireAuth(event);
	const id = event.params.id!;
	const entry = await getEntry(id, user.id);
	if (!entry) throw error(404, 'Entry not found');
	return { entry };
};

export const actions = {
	default: async (event: RequestEvent) => {
		const user = await requireAuth(event);
		const id = event.params.id!;
		const data = await event.request.formData();
		const title = (data.get('title') as string)?.trim();
		const type = data.get('type') as ContentType;
		const durationSeconds = Number(data.get('durationSeconds'));
		const sourceUrl = (data.get('sourceUrl') as string) || undefined;

		const errors: Record<string, string> = {};
		if (!title) errors.title = 'Title is required';
		if (!durationSeconds || isNaN(durationSeconds)) errors.duration = 'Valid duration is required';
		if (Object.keys(errors).length > 0) return fail(422, { errors });

		await updateEntry(id, user.id, { title, type, durationSeconds, sourceUrl });
		throw redirect(303, '/log');
	}
};
