import { prisma } from '$lib/server/prisma';

export async function load() {
	const entries = await prisma.entry.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});
	return {
		entries: entries.map((entry) => ({
			title: entry.title,
			duration: entry.duration,
			createdAt: entry.createdAt.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		}))
	};
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const duration = formData.get('duration');
		await prisma.entry.create({
			data: {
				title: title as string,
				duration: Number(duration)
			}
		});
	}
};
