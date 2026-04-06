import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { DEV_BYPASS_AUTH, DEV_USER_EMAIL, DEV_USER_ID } from '$lib/server/dev-auth';

export async function requireAuth(event: RequestEvent) {
	if (DEV_BYPASS_AUTH) {
		return {
			id: DEV_USER_ID,
			email: DEV_USER_EMAIL
		};
	}

	if (!event.locals.session) throw redirect(303, '/login');
	return event.locals.session.user;
}
