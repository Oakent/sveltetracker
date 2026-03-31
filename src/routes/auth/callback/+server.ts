import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { listProfiles } from '$lib/server/db/profiles';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ url, locals }: RequestEvent) => {
	const code = url.searchParams.get('code');
	if (code) {
		const {
			data: { user }
		} = await locals.supabase.auth.exchangeCodeForSession(code);
		if (user) {
			await prisma.user.upsert({
				where: { id: user.id },
				update: { email: user.email ?? '' },
				create: { id: user.id, email: user.email ?? '' }
			});

			const profiles = await listProfiles(user.id);
			if (profiles.length === 0) {
				redirect(303, '/settings/languages?reason=new');
			}
		}
	}
	redirect(303, '/dashboard');
};
