<script lang="ts">
  import { enhance } from '$app/forms'
  import { Button } from '$lib/components/ui/button/index.js'
  import { Input } from '$lib/components/ui/input/index.js'
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import { formatSeconds } from '$lib/utils/duration'

  let { data } = $props()

  let searchQuery = $state('')
  let searchResults = $state<any[]>([])
  let searching = $state(false)
  let searchOpen = $state(false)
  let searchTimer: ReturnType<typeof setTimeout>

  function onSearchInput() {
    clearTimeout(searchTimer)
    if (searchQuery.length < 2) { searchResults = []; return }
    searchTimer = setTimeout(async () => {
      searching = true
      const res = await fetch(`/api/enrich/tmdb?q=${encodeURIComponent(searchQuery)}&type=tv`)
      searchResults = await res.json()
      searching = false
    }, 400)
  }
</script>

<div class="flex items-center justify-between">
  <div>
    <h1 class="text-2xl font-semibold">TV shows</h1>
    <p class="text-muted-foreground mt-1 text-sm">{data.shows.length} shows in your library</p>
  </div>
  <Button onclick={() => (searchOpen = true)}>Add show</Button>
</div>

<!-- Show library grid -->
{#if data.shows.length === 0}
  <div class="border-border bg-card mt-4 rounded-lg border p-12 text-center">
    <p class="text-muted-foreground text-sm">No shows yet. <button class="text-primary underline" onclick={() => (searchOpen = true)}>Add your first one.</button></p>
  </div>
{:else}
  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {#each data.shows as show (show.id)}
      {@const meta = show.showMetadata as any}
      <a href="/tv/{show.id}" class="bg-card border-border hover:border-primary group rounded-lg border p-4 transition-colors">
        <p class="font-medium leading-snug">{show.title}</p>
        <p class="text-muted-foreground mt-1 text-xs">
          {meta?.numberOfSeasons ?? '?'} season{(meta?.numberOfSeasons ?? 0) !== 1 ? 's' : ''}
          · {show._count.episodeLogs} watched
        </p>
      </a>
    {/each}
  </div>
{/if}

<!-- Add show dialog -->
<Dialog.Root bind:open={searchOpen}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>Add TV show</Dialog.Title>
    </Dialog.Header>
    <Input
      bind:value={searchQuery}
      oninput={onSearchInput}
      placeholder="Search for a show..."
      autofocus
    />
    <div class="mt-2 space-y-1">
      {#if searching}
        <p class="text-muted-foreground px-1 text-sm">Searching…</p>
      {/if}
      {#each searchResults as result (result.tmdbId)}
        <form method="POST" action="?/add" use:enhance={() => {
          return ({ update }) => { searchOpen = false; update() }
        }}>
          <input type="hidden" name="tmdbId" value={result.tmdbId} />
          <button
            type="submit"
            class="hover:bg-muted flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium">{result.title}</p>
              {#if result.year}
                <p class="text-muted-foreground text-xs">{result.year}</p>
              {/if}
            </div>
          </button>
        </form>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>
