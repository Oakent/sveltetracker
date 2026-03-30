import { createBrowserClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

export const load = async ({
	data,
	fetch,
	depends
}: {
	data: { session: Session | null; user: User | null };
	fetch: typeof globalThis.fetch;
	depends: (key: string) => void;
}): Promise<{ supabase: SupabaseClient; session: Session | null; user: User | null }> => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
		cookies: {
			getAll: () =>
				isBrowser()
					? document.cookie.split('; ').map((c) => {
							const [name, ...rest] = c.split('=');
							return { name, value: rest.join('=') };
						})
					: [],
			setAll: (cookies) => {}
		}
	});

	return { supabase, session: data.session, user: data.user };
};
