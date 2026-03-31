import { fail, redirect } from '@sveltejs/kit';
import {
	listProfilesWithTime,
	createProfile,
	deleteProfile,
	updateProfile
} from '$lib/server/db/profiles';
import { COMMON_LANGUAGES } from '$lib/data/languages';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const user = event.locals.session?.user;
	if (!user) throw redirect(303, '/login');

	const profiles = await listProfilesWithTime(user.id);

	const profilesWithTime = profiles.map((profile) => ({
		...profile,
		totalSeconds: profile.contentEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0)
	}));

	return {
		profiles: profilesWithTime,
		availableLanguages: COMMON_LANGUAGES
	};
};

export const actions = {
	create: async (event: RequestEvent) => {
		const user = event.locals.session?.user;
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await event.request.formData();
		const languageCode = formData.get('languageCode') as string;
		const displayName = formData.get('displayName') as string;

		if (!languageCode || !displayName) {
			return fail(400, { error: 'Language and name are required' });
		}

		const existingProfiles = await listProfilesWithTime(user.id);
		const isFirst = existingProfiles.length === 0;

		await createProfile(user.id, languageCode, displayName);

		const newProfile = await prisma.languageProfile.findFirst({
			where: { userId: user.id },
			orderBy: { createdAt: 'desc' }
		});

		if (newProfile) {
			event.cookies.set('activeProfileId', newProfile.id, { path: '/' });
		}

		return { success: true };
	},

	delete: async (event: RequestEvent) => {
		const user = event.locals.session?.user;
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Profile ID is required' });
		}

		await deleteProfile(id, user.id);

		const remaining = await listProfilesWithTime(user.id);
		if (remaining.length > 0) {
			event.cookies.set('activeProfileId', remaining[0].id, { path: '/' });
		} else {
			event.cookies.delete('activeProfileId', { path: '/' });
		}

		return { success: true };
	},

	update: async (event: RequestEvent) => {
		const user = event.locals.session?.user;
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const displayName = formData.get('displayName') as string;

		if (!id || !displayName) {
			return fail(400, { error: 'Profile ID and name are required' });
		}

		await updateProfile(id, user.id, { displayName });

		return { success: true };
	}
};
