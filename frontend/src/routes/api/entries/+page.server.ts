import { prisma } from '$lib/server/prisma';

export async function load() {
	const entries = await prisma.entry.findMany();
	return { entries };
}
