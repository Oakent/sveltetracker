import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
	const { session, user } = await event.locals.safeGetSession();
	if (!session) throw redirect(303, '/login');
	return { session, user };
}
