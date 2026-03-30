import { prisma } from '../prisma';

export const listProfiles = (userId: string) => {
	return prisma.languageProfile.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
};

export const listProfilesWithTime = (userId: string) => {
	return prisma.languageProfile.findMany({
		where: { userId },
		orderBy: { createdAt: 'asc' },
		include: {
			contentEntries: {
				select: { durationSeconds: true }
			}
		}
	});
};

export const createProfile = (userId: string, languageCode: string, displayName: string) => {
	return prisma.languageProfile.create({ data: { userId, languageCode, displayName } });
};

export const updateProfile = (
	id: string,
	userId: string,
	data: { displayName?: string; languageCode?: string }
) => {
	return prisma.languageProfile.updateMany({
		where: { id, userId },
		data
	});
};

export const deleteProfile = (id: string, userId: string) => {
	return prisma.languageProfile.deleteMany({ where: { id, userId } });
};
