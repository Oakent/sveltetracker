import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { DEV_BYPASS_AUTH, DEV_USER_EMAIL, DEV_USER_ID } from '$lib/server/dev-auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (DEV_BYPASS_AUTH) {
		event.locals.supabase = null as any;
		event.locals.safeGetSession = async () => ({
			session: {
				user: {
					id: DEV_USER_ID,
					email: DEV_USER_EMAIL
				}
			} as any,
			user: {
				id: DEV_USER_ID,
				email: DEV_USER_EMAIL
			} as any
		});
		event.locals.session = {
			user: {
				id: DEV_USER_ID,
				email: DEV_USER_EMAIL
			}
		} as any;

		return resolve(event);
	}

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookies) =>
				cookies.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) return { session: null, user: null };

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) return { session: null, user: null };
		return { session, user };
	};

	const { session } = await event.locals.safeGetSession();
	event.locals.session = session;

	return resolve(event);
};
