// src/lib/server/db/content.ts
import { prisma } from '../prisma';
import type { ContentType } from '@prisma/client';
import { error } from '@sveltejs/kit';

// All queries check both profileId AND userId to prevent cross-user data access
export const listEntries = (profileId: string, userId: string) =>
	prisma.contentEntry.findMany({
		where: { profileId, profile: { userId } },
		orderBy: { loggedAt: 'desc' }
	});

export const getEntry = (id: string, userId: string) =>
	prisma.contentEntry.findFirst({
		where: { id, profile: { userId } }
	});

export const createEntry = async (data: {
	profileId: string;
	userId: string;
	type: ContentType;
	title: string;
	durationSeconds: number;
	sourceUrl?: string;
	metadata?: object;
}) => {
	const profile = await prisma.languageProfile.findFirst({
		where: { id: data.profileId, userId: data.userId }
	});
	if (!profile) throw error(403, 'Profile not found');

	const entry = await prisma.contentEntry.create({
		data: {
			profileId: data.profileId,
			type: data.type,
			title: data.title,
			durationSeconds: data.durationSeconds,
			sourceUrl: data.sourceUrl,
			metadata: data.metadata
		}
	});
	return entry;
};

export const updateEntry = (
	id: string,
	userId: string,
	data: Partial<{
		title: string;
		type: ContentType;
		durationSeconds: number;
		sourceUrl: string;
		loggedAt: Date;
	}>
) =>
	prisma.contentEntry.updateMany({
		where: { id, profile: { userId } }, // ownership enforced via join
		data
	});

export const deleteEntry = (id: string, userId: string) =>
	prisma.contentEntry.deleteMany({ where: { id, profile: { userId } } });
