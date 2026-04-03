import { requireAuth } from '$lib/server/auth';
import { createEntry } from '$lib/server/db/content';
import { fail, redirect } from '@sveltejs/kit';
import type { ContentType } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	await requireAuth(event);
	const activeProfileId = event.cookies.get('activeProfileId');
	if (!activeProfileId) {
		throw redirect(303, '/settings/languages?reason=required&page=Log%20content');
	}
};

export const actions = {
	default: async (event: RequestEvent) => {
		const user = await requireAuth(event);
		const activeProfileId = event.cookies.get('activeProfileId');
		if (!activeProfileId) return fail(400, { message: 'No active language profile selected' });

		const data = await event.request.formData();
		const title = (data.get('title') as string)?.trim();
		const type = data.get('type') as ContentType;
		const durationSeconds = Number(data.get('durationSeconds'));
		const sourceUrl = (data.get('sourceUrl') as string) || undefined;
		const speedMultiplier = parseFloat(data.get('speedMultiplier') as string) || 1.0;
		const loggedAtStr = data.get('loggedAt') as string;

		const errors: Record<string, string> = {};
		if (!title) errors.title = 'Title is required';
		if (!durationSeconds || isNaN(durationSeconds)) errors.duration = 'Valid duration is required';
		if (speedMultiplier <= 0) errors.speedMultiplier = 'Speed multiplier must be greater than 0';

		if (Object.keys(errors).length > 0) {
			return fail(422, { errors, values: { title, type, sourceUrl } });
		}

		const adjustedDuration = Math.round(durationSeconds / speedMultiplier);
		const loggedAt = loggedAtStr ? new Date(loggedAtStr + 'T00:00:00') : new Date();

		await createEntry({
			profileId: activeProfileId,
			userId: user.id,
			type,
			title,
			durationSeconds: adjustedDuration,
			sourceUrl,
			loggedAt
		});
		throw redirect(303, '/log');
	}
};
