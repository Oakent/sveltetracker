import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
	await event.locals.supabase.auth.signOut();
	throw redirect(303, '/');
};
