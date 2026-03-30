import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { supabaseStore, sessionStore } from '$lib/stores/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load = async ({
	data,
	fetch
}: {
	data: { session: any };
	fetch: typeof globalThis.fetch;
}) => {
	if (browser) {
		let client = get(supabaseStore);

		if (client === null) {
			client = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch },
				cookies: {
					getAll: () => {
						if (!isBrowser()) return [];
						const parsed = parse(document.cookie);
						return Object.entries(parsed).map(([name, value]) => ({ name, value: value ?? '' }));
					},
					setAll: (cookiesToSet) => {
						if (!isBrowser()) return;
						cookiesToSet.forEach(({ name, value, options }) => {
							document.cookie = `${name}=${value}${options?.expires ? `; expires=${new Date(options.expires).toUTCString()}` : ''}${options?.path ? `; path=${options.path}` : ''}${options?.sameSite ? `; samesite=${options.sameSite}` : ''}`;
						});
					}
				}
			});
			supabaseStore.set(client);
		}

		const {
			data: { session }
		} = await client.auth.getSession();

		if (session) {
			const {
				data: { user },
				error
			} = await client.auth.getUser();
			if (!error && user) {
				sessionStore.set(session);
				return {
					session,
					user
				};
			}
		}

		sessionStore.set(null);

		client.auth.onAuthStateChange((_event: string, newSession: any) => {
			sessionStore.set(newSession);
		});

		return {
			session: null,
			user: null
		};
	}

	return {
		session: null,
		user: data?.session?.user ?? null
	};
};
