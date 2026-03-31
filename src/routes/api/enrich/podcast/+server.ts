import { json, error } from '@sveltejs/kit'
import { searchPodcasts, getFeedByUrl, getEpisodes } from '$lib/server/enrichment/podcast'
import { requireAuth } from '$lib/server/auth'

export const GET = async (event) => {
  requireAuth(event)
  const q = event.url.searchParams.get('q')
  if (!q) throw error(400, 'Missing q')
  return json(await searchPodcasts(q))
}

export const POST = async (event) => {
  requireAuth(event)
  const { feedUrl, action } = await event.request.json()
  if (!feedUrl) throw error(400, 'Missing feedUrl')

  if (action === 'episodes') return json(await getEpisodes(feedUrl))

  const feed = await getFeedByUrl(feedUrl)
  if (!feed) throw error(404, 'Feed not found')
  return json(feed)
}
