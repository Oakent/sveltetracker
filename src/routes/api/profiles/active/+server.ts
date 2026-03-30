import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const PATCH = async (event: RequestEvent) => {
	const formData = await event.request.formData();
	const profileId = formData.get('profileId') as string;

	if (!profileId) {
		return json({ error: 'Profile ID is required' }, { status: 400 });
	}

	event.cookies.set('activeProfileId', profileId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 60 * 60 * 24 * 365
	});

	return json({ success: true });
};
