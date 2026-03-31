import { prisma } from '../prisma';

export const getLibrary = (profileId: string, userId: string) =>
	prisma.tvShowLibrary.findMany({
		where: { profileId, profile: { userId } },
		include: { _count: { select: { episodeLogs: true } } },
		orderBy: { title: 'asc' }
	});

export const addShow = async (
	profileId: string,
	userId: string,
	data: { tmdbShowId: string; title: string; showMetadata: object }
) => {
	const profile = await prisma.languageProfile.findFirst({
		where: { id: profileId, userId }
	});
	if (!profile) throw new Error('Profile not found');

	const metadata = data.showMetadata as any;
	return prisma.tvShowLibrary.create({
		data: {
			profileId,
			externalShowId: data.tmdbShowId,
			title: data.title,
			totalSeasons: metadata.numberOfSeasons ?? 0,
			showMetadata: data.showMetadata
		}
	});
};

export const removeShow = (id: string, userId: string) =>
	prisma.tvShowLibrary.deleteMany({
		where: { id, profile: { userId } }
	});

export const getShowWithLog = (libraryId: string, userId: string) =>
	prisma.tvShowLibrary.findFirst({
		where: { id: libraryId, profile: { userId } },
		include: { episodeLogs: true }
	});

export const toggleEpisode = async (
	libraryId: string,
	userId: string,
	episode: { seasonNumber: number; episodeNumber: number; durationSeconds?: number }
) => {
	const library = await prisma.tvShowLibrary.findFirst({
		where: { id: libraryId, profile: { userId } }
	});
	if (!library) throw new Error('Not found');

	const existing = await prisma.episodeLog.findUnique({
		where: {
			libraryId_seasonNumber_episodeNumber: {
				libraryId,
				seasonNumber: episode.seasonNumber,
				episodeNumber: episode.episodeNumber
			}
		}
	});

	if (existing) {
		await prisma.episodeLog.delete({ where: { id: existing.id } });
		await prisma.contentEntry.delete({ where: { id: existing.contentEntryId } });
		return { watched: false };
	} else {
		const contentEntry = await prisma.contentEntry.create({
			data: {
				profileId: library.profileId,
				type: 'tv_episode',
				title: `${library.title} S${episode.seasonNumber}E${episode.episodeNumber}`,
				durationSeconds: episode.durationSeconds ?? 0,
				sourceUrl: `https://themoviedb.org/tv/${library.externalShowId}/season/${episode.seasonNumber}/episode/${episode.episodeNumber}`,
				metadata: { seasonNumber: episode.seasonNumber, episodeNumber: episode.episodeNumber }
			}
		});

		await prisma.episodeLog.create({
			data: {
				libraryId,
				contentEntryId: contentEntry.id,
				seasonNumber: episode.seasonNumber,
				episodeNumber: episode.episodeNumber,
				durationSeconds: episode.durationSeconds ?? 0
			}
		});
		return { watched: true };
	}
};
