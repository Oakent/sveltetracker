<script lang="ts">
  import { enhance } from '$app/forms'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Accordion from '$lib/components/ui/accordion/index.js'
  import { formatSeconds } from '$lib/utils/duration'

  let { data } = $props()

  // Reactive set of watched keys so checkboxes update instantly
  let watched = $state(new Set(data.watchedSet))

  const meta = data.show.showMetadata as any

  const totalWatched = $derived(watched.size)
  const totalEpisodes = $derived(data.seasons.flat().length)
</script>

<div class="mb-6 flex items-start justify-between">
  <div>
    <h1 class="text-2xl font-semibold">{data.show.title}</h1>
    <p class="text-muted-foreground mt-1 text-sm">
      {totalWatched} / {totalEpisodes} episodes watched
    </p>
  </div>
  <Button variant="ghost" href="/tv">Back</Button>
</div>

<!-- Progress bar -->
<div class="bg-muted mb-6 h-2 w-full rounded-full">
  <div
    class="bg-primary h-2 rounded-full transition-all"
    style="width: {totalEpisodes > 0 ? (totalWatched / totalEpisodes) * 100 : 0}%"
  ></div>
</div>

<Accordion.Root type="multiple" class="space-y-2">
  {#each data.seasons as episodes, i (i)}
    {@const seasonNum = i + 1}
    {@const seasonWatched = episodes.filter((ep: any) => watched.has(`${ep.seasonNumber}-${ep.episodeNumber}`)).length}
    <Accordion.Item value="season-{seasonNum}" class="border-border bg-card rounded-lg border px-4">
      <Accordion.Trigger class="py-3 text-sm font-medium">
        Season {seasonNum}
        <span class="text-muted-foreground ml-auto mr-4 font-normal">
          {seasonWatched}/{episodes.length}
        </span>
      </Accordion.Trigger>
      <Accordion.Content>
        <div class="space-y-1 pb-3">
          {#each episodes as ep (`${ep.seasonNumber}-${ep.episodeNumber}`)}
            {@const key = `${ep.seasonNumber}-${ep.episodeNumber}`}
            {@const isWatched = watched.has(key)}
            <form
              method="POST"
              action="?/toggle"
              use:enhance={() => {
                // Optimistic update
                if (isWatched) watched.delete(key)
                else watched.add(key)
                watched = new Set(watched)
                return ({ result, update }) => {
                  if (result.type === 'error') {
                    // Revert on failure
                    if (isWatched) watched.add(key)
                    else watched.delete(key)
                    watched = new Set(watched)
                  }
                  update({ reset: false })
                }
              }}
              class="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
            >
              <input type="hidden" name="seasonNumber" value={ep.seasonNumber} />
              <input type="hidden" name="episodeNumber" value={ep.episodeNumber} />
              <input type="hidden" name="durationSeconds" value={ep.durationSeconds ?? ''} />
              <button
                type="submit"
                class="border-border flex h-4 w-4 shrink-0 items-center justify-center rounded border {isWatched ? 'bg-primary border-primary' : ''}"
                aria-label="Toggle watched"
              >
                {#if isWatched}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                {/if}
              </button>
              <span class="flex-1 text-sm {isWatched ? 'text-muted-foreground line-through' : ''}">
                {ep.episodeNumber}. {ep.title}
              </span>
              {#if ep.durationSeconds}
                <span class="text-muted-foreground text-xs">{formatSeconds(ep.durationSeconds)}</span>
              {/if}
            </form>
          {/each}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
