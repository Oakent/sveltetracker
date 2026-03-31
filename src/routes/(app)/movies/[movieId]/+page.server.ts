import { requireAuth } from '$lib/server/auth';
import { getMovieWithLog, toggleMovie } from '$lib/server/db/movies';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const user = requireAuth(event);
	const movie = await getMovieWithLog(event.params.movieId, user.id);
	if (!movie) throw error(404, 'Movie not found');

	const watched = movie.movieLogs.length > 0;

	return { movie, watched };
};

export const actions = {
	toggle: async (event) => {
		const user = requireAuth(event);
		return toggleMovie(event.params.movieId, user.id);
	}
};
