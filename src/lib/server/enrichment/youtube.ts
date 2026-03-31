import { isoToSeconds } from './duration';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function enrichYouTube(url: string) {
	const videoId = extractVideoId(url);
	if (!videoId) throw new Error('Invalid YouTube URL');

	const res = await fetch(
		`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
	);
	const data = await res.json();
	const item = data.items?.[0];
	if (!item) throw new Error('Video not found');

	return {
		title: item.snippet.title as string,
		durationSeconds: isoToSeconds(item.contentDetails.duration),
		sourceUrl: url
	};
}

function extractVideoId(url: string): string | null {
	const patterns = [
		/youtube\.com\/watch\?v=([^&]+)/,
		/youtu\.be\/([^?]+)/,
		/youtube\.com\/embed\/([^?]+)/
	];
	for (const p of patterns) {
		const m = url.match(p);
		if (m) return m[1];
	}
	return null;
}
