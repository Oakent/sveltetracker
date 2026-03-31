import { minutesToSeconds } from './duration';

const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

const tmdbFetch = (path: string) =>
	fetch(`${BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`).then((r) => r.json());

// Search both movies and TV shows together
export const searchTmdb = async (query: string, type: 'movie' | 'tv' | 'multi' = 'multi') => {
	const data = await tmdbFetch(
		`/search/${type}?query=${encodeURIComponent(query)}&include_adult=false`
	);
	return (data.results ?? [])
		.filter((r: any) => r.media_type !== 'person')
		.slice(0, 8)
		.map((r: any) => ({
			tmdbId: String(r.id),
			mediaType: (r.media_type ?? type) as 'movie' | 'tv',
			title: r.title ?? r.name ?? '',
			posterPath: r.poster_path ?? null,
			year: (r.release_date ?? r.first_air_date ?? '').slice(0, 4),
			overview: r.overview ?? ''
		}));
};

// Movie: returns a single entry-ready object
export const getMovieDetails = async (tmdbId: string) => {
	const data = await tmdbFetch(`/movie/${tmdbId}`);
	return {
		title: data.title as string,
		durationSeconds: data.runtime ? minutesToSeconds(data.runtime) : null,
		sourceUrl: `https://www.themoviedb.org/movie/${tmdbId}`,
		metadata: {
			tmdbId,
			posterPath: data.poster_path,
			releaseDate: data.release_date,
			overview: data.overview
		}
	};
};

// TV show: returns show-level metadata
export const getShowDetails = async (tmdbId: string) => {
	const data = await tmdbFetch(`/tv/${tmdbId}`);
	return {
		tmdbShowId: tmdbId,
		title: data.name as string,
		showMetadata: {
			posterPath: data.poster_path,
			numberOfSeasons: data.number_of_seasons,
			numberOfEpisodes: data.number_of_episodes,
			overview: data.overview,
			firstAirDate: data.first_air_date
		}
	};
};

// TV season: returns all episodes with durations
export const getSeason = async (tmdbId: string, seasonNumber: number) => {
	const data = await tmdbFetch(`/tv/${tmdbId}/season/${seasonNumber}`);
	return (data.episodes ?? []).map((ep: any) => ({
		seasonNumber: ep.season_number as number,
		episodeNumber: ep.episode_number as number,
		title: ep.name as string,
		durationSeconds: ep.runtime ? minutesToSeconds(ep.runtime) : null,
		airDate: ep.air_date ?? null,
		stillPath: ep.still_path ?? null
	}));
};
