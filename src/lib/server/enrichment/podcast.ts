import crypto from 'crypto';
import Parser from 'rss-parser';

const PI_KEY = process.env.PODCAST_INDEX_KEY!;
const PI_SECRET = process.env.PODCAST_INDEX_SECRET!;
const PI_BASE = 'https://api.podcastindex.org/api/1.0';

// Podcast Index requires a fresh HMAC-SHA1 hash per request
function podcastIndexHeaders() {
	const authDate = Math.floor(Date.now() / 1000).toString();
	const hash = crypto
		.createHash('sha1')
		.update(PI_KEY + PI_SECRET + authDate)
		.digest('hex');
	return {
		'X-Auth-Key': PI_KEY,
		'X-Auth-Date': authDate,
		Authorization: hash,
		'User-Agent': 'LanguageTracker/1.0'
	};
}

const piFetch = (path: string) =>
	fetch(`${PI_BASE}${path}`, { headers: podcastIndexHeaders() }).then((r) => r.json());

export const searchPodcasts = async (query: string) => {
	const data = await piFetch(`/search/byterm?q=${encodeURIComponent(query)}&max=8&clean`);
	return (data.feeds ?? []).map((f: any) => ({
		feedUrl: f.url as string,
		title: f.title as string,
		author: f.author ?? '',
		artworkUrl: f.artwork ?? f.image ?? null,
		episodeCount: f.episodeCount ?? null
	}));
};

export const getFeedByUrl = async (feedUrl: string) => {
	const data = await piFetch(`/podcasts/byfeedurl?url=${encodeURIComponent(feedUrl)}`);
	return data.feed
		? {
				feedUrl,
				title: data.feed.title as string,
				feedMetadata: {
					author: data.feed.author,
					artworkUrl: data.feed.artwork ?? data.feed.image,
					description: data.feed.description
				}
			}
		: null;
};

// Episodes via Podcast Index
export const getEpisodes = async (feedUrl: string, max = 100) => {
	const data = await piFetch(`/episodes/byfeedurl?url=${encodeURIComponent(feedUrl)}&max=${max}`);
	if (data.items?.length) return normaliseEpisodes(data.items, 'pi');

	// Fallback: parse RSS directly if Podcast Index doesn't have it
	return parseFeedRss(feedUrl);
};

function normaliseEpisodes(items: any[], source: 'pi' | 'rss') {
	return items.map((ep: any) => ({
		guid: source === 'pi' ? String(ep.id) : (ep.guid ?? ep.link ?? ''),
		title: ep.title ?? '',
		durationSeconds: source === 'pi' ? (ep.duration ?? null) : parseDuration(ep.itunes?.duration),
		pubDate: source === 'pi' ? new Date(ep.datePublished * 1000).toISOString() : ep.pubDate,
		enclosureUrl: source === 'pi' ? (ep.enclosureUrl ?? null) : (ep.enclosure?.url ?? null)
	}));
}

async function parseFeedRss(feedUrl: string) {
	const parser = new Parser();
	const feed = await parser.parseURL(feedUrl);
	return normaliseEpisodes(feed.items ?? [], 'rss');
}

function parseDuration(raw: string | undefined): number | null {
	if (!raw) return null;
	const parts = raw.split(':').map(Number);
	if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
	if (parts.length === 2) return parts[0] * 60 + parts[1];
	return Number(raw) || null;
}
