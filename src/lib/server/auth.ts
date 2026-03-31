import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true';
const DEV_USER_ID = process.env.DEV_USER_ID || '00000000-0000-0000-0000-000000000001';
const DEV_USER_EMAIL = process.env.DEV_USER_EMAIL || 'dev@example.com';

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