import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
	if (!event.locals.session) throw redirect(303, '/login');
	return event.locals.session.user;
}
