import { requireAuth } from '$lib/server/auth';
import { listProfiles } from '$lib/server/db/profiles';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const user = await requireAuth(event);
	const profiles = await listProfiles(user.id);
	const activeProfileId = event.cookies.get('activeProfileId') ?? profiles[0]?.id ?? null;
	return {
		profiles,
		activeProfileId,
		user
	};
};
