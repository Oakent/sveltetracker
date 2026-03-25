import { prisma } from '$lib/server/prisma';

export async function load() {
	const entries = await prisma.entry.findMany();
	console.log('entries', entries);
	return {
		entries: entries.map((entry) => ({
			title: entry.title,
			duration: entry.duration
		}))
	};
}
