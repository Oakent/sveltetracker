import { prisma } from '../prisma';

export const getFeeds = (profileId: string, userId: string) =>
	prisma.podcastFeed.findMany({
		where: { profileId, profile: { userId } },
		include: { _count: { select: { podcastEpisodeLogs: true } } },
		orderBy: { title: 'asc' }
	});

export const followFeed = async (
	profileId: string,
	userId: string,
	data: { feedUrl: string; title: string; feedMetadata: object }
) => {
	const profile = await prisma.languageProfile.findFirst({
		where: { id: profileId, userId }
	});
	if (!profile) throw new Error('Profile not found');

	return prisma.podcastFeed.create({
		data: { profileId, ...data }
	});
};

export const unfollowFeed = (id: string, userId: string) =>
	prisma.podcastFeed.deleteMany({
		where: { id, profile: { userId } }
	});

export const getFeedWithLog = (feedId: string, userId: string) =>
	prisma.podcastFeed.findFirst({
		where: { id: feedId, profile: { userId } },
		include: { podcastEpisodeLogs: true }
	});

export const toggleEpisode = async (
	feedId: string,
	userId: string,
	episode: { episodeGuid: string; title: string; durationSeconds?: number }
) => {
	const feed = await prisma.podcastFeed.findFirst({
		where: { id: feedId, profile: { userId } }
	});
	if (!feed) throw new Error('Not found');

	const existing = await prisma.podcastEpisodeLog.findUnique({
		where: { feedId_episodeGuid: { feedId, episodeGuid: episode.episodeGuid } }
	});

	if (existing) {
		await prisma.podcastEpisodeLog.delete({ where: { id: existing.id } });
		await prisma.contentEntry.delete({ where: { id: existing.contentEntryId } });
		return { listened: false };
	} else {
		const contentEntry = await prisma.contentEntry.create({
			data: {
				profileId: feed.profileId,
				type: 'podcast',
				title: episode.title,
				durationSeconds: episode.durationSeconds ?? 0,
				sourceUrl: feed.feedUrl,
				metadata: { episodeGuid: episode.episodeGuid }
			}
		});

		await prisma.podcastEpisodeLog.create({
			data: {
				feedId,
				contentEntryId: contentEntry.id,
				episodeGuid: episode.episodeGuid,
				title: episode.title,
				durationSeconds: episode.durationSeconds ?? 0
			}
		});
		return { listened: true };
	}
};
