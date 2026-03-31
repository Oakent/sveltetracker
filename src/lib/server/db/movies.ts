import { prisma } from '../prisma';

export const getLibrary = (profileId: string, userId: string) =>
	prisma.movieLibrary.findMany({
		where: { profileId, profile: { userId } },
		include: { _count: { select: { movieLogs: true } } },
		orderBy: { title: 'asc' }
	});

export const addMovie = async (
	profileId: string,
	userId: string,
	data: { tmdbMovieId: string; title: string; movieMetadata: object }
) => {
	const profile = await prisma.languageProfile.findFirst({
		where: { id: profileId, userId }
	});
	if (!profile) throw new Error('Profile not found');

	return prisma.movieLibrary.create({
		data: {
			profileId,
			externalMovieId: data.tmdbMovieId,
			title: data.title,
			movieMetadata: data.movieMetadata
		}
	});
};

export const removeMovie = (id: string, userId: string) =>
	prisma.movieLibrary.deleteMany({
		where: { id, profile: { userId } }
	});

export const getMovieWithLog = (libraryId: string, userId: string) =>
	prisma.movieLibrary.findFirst({
		where: { id: libraryId, profile: { userId } },
		include: { movieLogs: true }
	});

export const toggleMovie = async (libraryId: string, userId: string) => {
	const library = await prisma.movieLibrary.findFirst({
		where: { id: libraryId, profile: { userId } }
	});
	if (!library) throw new Error('Not found');

	const existing = await prisma.movieLog.findUnique({
		where: { libraryId }
	});

	if (existing) {
		await prisma.movieLog.delete({ where: { id: existing.id } });
		await prisma.contentEntry.delete({ where: { id: existing.contentEntryId } });
		return { watched: false };
	} else {
		const meta = library.movieMetadata as any;
		const contentEntry = await prisma.contentEntry.create({
			data: {
				profileId: library.profileId,
				type: 'movie',
				title: library.title,
				durationSeconds: meta?.runtime ? meta.runtime * 60 : 0,
				sourceUrl: `https://www.themoviedb.org/movie/${library.externalMovieId}`,
				metadata: library.movieMetadata ?? undefined
			}
		});

		await prisma.movieLog.create({
			data: {
				libraryId,
				contentEntryId: contentEntry.id
			}
		});
		return { watched: true };
	}
};
