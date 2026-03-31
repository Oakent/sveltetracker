<script lang="ts">
  import { enhance } from '$app/forms'
  import { Button } from '$lib/components/ui/button/index.js'
  import { formatSeconds } from '$lib/utils/duration'

  let { data } = $props()

  let listened = $state(new Set(data.listenedSet))
  const meta = data.feed.feedMetadata as any

  const totalListened = $derived(listened.size)
</script>

<div class="mb-6 flex items-start justify-between">
  <div>
    <h1 class="text-2xl font-semibold">{data.feed.title}</h1>
    {#if meta?.author}
      <p class="text-muted-foreground text-sm">{meta.author}</p>
    {/if}
    <p class="text-muted-foreground mt-1 text-sm">
      {totalListened} / {data.episodes.length} episodes listened
    </p>
  </div>
  <Button variant="ghost" href="/podcasts">Back</Button>
</div>

<div class="space-y-1">
  {#each data.episodes as ep (ep.guid)}
    {@const isListened = listened.has(ep.guid)}
    <form
      method="POST"
      action="?/toggle"
      use:enhance={() => {
        if (isListened) listened.delete(ep.guid)
        else listened.add(ep.guid)
        listened = new Set(listened)
        return ({ result, update }) => {
          if (result.type === 'error') {
            if (isListened) listened.add(ep.guid)
            else listened.delete(ep.guid)
            listened = new Set(listened)
          }
          update({ reset: false })
        }
      }}
      class="border-border hover:bg-muted flex items-center gap-3 rounded-md border-b px-2 py-2.5 last:border-b-0 transition-colors"
    >
      <input type="hidden" name="guid" value={ep.guid} />
      <input type="hidden" name="title" value={ep.title} />
      <input type="hidden" name="durationSeconds" value={ep.durationSeconds ?? ''} />
      <button
        type="submit"
        class="border-border flex h-4 w-4 shrink-0 items-center justify-center rounded-full border {isListened ? 'bg-primary border-primary' : ''}"
        aria-label="Toggle listened"
      >
        {#if isListened}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      </button>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm {isListened ? 'text-muted-foreground line-through' : ''}">
          {ep.title}
        </p>
        {#if ep.pubDate}
          <p class="text-muted-foreground text-xs">{new Date(ep.pubDate).toLocaleDateString()}</p>
        {/if}
      </div>
      {#if ep.durationSeconds}
        <span class="text-muted-foreground shrink-0 text-xs">{formatSeconds(ep.durationSeconds)}</span>
      {/if}
    </form>
  {/each}
</div>
