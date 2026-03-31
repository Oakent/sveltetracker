<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { data } = $props();

	let searchQuery = $state('');
	let searchResults = $state<any[]>([]);
	let feedUrl = $state('');
	let searching = $state(false);
	let addOpen = $state(false);
	let searchTimer: ReturnType<typeof setTimeout>;

	function onSearchInput() {
		clearTimeout(searchTimer);
		feedUrl = '';
		if (searchQuery.length < 2) {
			searchResults = [];
			return;
		}
		searchTimer = setTimeout(async () => {
			searching = true;
			const res = await fetch(`/api/enrich/podcast?q=${encodeURIComponent(searchQuery)}`);
			searchResults = await res.json();
			searching = false;
		}, 400);
	}

	function selectFeed(url: string) {
		feedUrl = url;
		searchQuery = '';
		searchResults = [];
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-semibold">Podcasts</h1>
		<p class="mt-1 text-sm text-muted-foreground">{data.feeds.length} feeds followed</p>
	</div>
	<Button onclick={() => (addOpen = true)}>Add podcast</Button>
</div>

{#if data.feeds.length === 0}
	<div class="mt-4 rounded-lg border border-border bg-card p-12 text-center">
		<p class="text-sm text-muted-foreground">
			No podcasts yet. <button class="text-primary underline" onclick={() => (addOpen = true)}
				>Add your first one.</button
			>
		</p>
	</div>
{:else}
	<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.feeds as feed (feed.id)}
			{@const meta = feed.feedMetadata as any}
			<a
				href="/podcasts/{feed.id}"
				class="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
			>
				<p class="leading-snug font-medium">{feed.title}</p>
				{#if meta?.author}
					<p class="mt-0.5 text-xs text-muted-foreground">{meta.author}</p>
				{/if}
				<p class="mt-2 text-xs text-muted-foreground">
					{feed._count.podcastEpisodeLogs} episodes listened
				</p>
			</a>
		{/each}
	</div>
{/if}

<Dialog.Root
	bind:open={addOpen}
	onOpenChange={(o) => {
		if (!o) {
			searchQuery = '';
			searchResults = [];
			feedUrl = '';
		}
	}}
>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add podcast</Dialog.Title>
		</Dialog.Header>

		<!-- Step 1: search or paste RSS -->
		{#if !feedUrl}
			<Input
				bind:value={searchQuery}
				oninput={onSearchInput}
				placeholder="Search or paste RSS feed URL…"
				autofocus
			/>
			<div class="mt-2 space-y-1">
				{#if searching}
					<p class="px-1 text-sm text-muted-foreground">Searching…</p>
				{/if}
				{#each searchResults as result (result.feedUrl)}
					<button
						type="button"
						onclick={() => selectFeed(result.feedUrl)}
						class="flex w-full flex-col rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
					>
						<span class="font-medium">{result.title}</span>
						{#if result.author}
							<span class="text-xs text-muted-foreground">{result.author}</span>
						{/if}
					</button>
				{/each}
				<!-- Paste RSS URL directly -->
				{#if searchQuery.startsWith('http')}
					<button
						type="button"
						onclick={() => selectFeed(searchQuery)}
						class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
					>
						Use RSS feed: <span class="truncate text-muted-foreground">{searchQuery}</span>
					</button>
				{/if}
			</div>
		{:else}
			<!-- Step 2: confirm and follow -->
			<div class="rounded-md bg-muted p-3 text-sm">
				<p class="font-medium">Ready to follow</p>
				<p class="mt-0.5 truncate text-xs text-muted-foreground">{feedUrl}</p>
			</div>
			<form
				method="POST"
				action="?/follow"
				use:enhance={() => {
					return ({ update }) => {
						addOpen = false;
						update();
					};
				}}
				class="mt-3 flex gap-2"
			>
				<input type="hidden" name="feedUrl" value={feedUrl} />
				<Button variant="ghost" type="button" onclick={() => (feedUrl = '')}>Back</Button>
				<Button type="submit" class="flex-1">Follow podcast</Button>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
