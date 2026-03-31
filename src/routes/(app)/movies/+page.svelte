<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { data } = $props();

	let searchQuery = $state('');
	let searchResults = $state<any[]>([]);
	let searching = $state(false);
	let searchOpen = $state(false);
	let searchTimer: ReturnType<typeof setTimeout>;

	function onSearchInput() {
		clearTimeout(searchTimer);
		if (searchQuery.length < 2) {
			searchResults = [];
			return;
		}
		searchTimer = setTimeout(async () => {
			searching = true;
			const res = await fetch(`/api/enrich/tmdb?q=${encodeURIComponent(searchQuery)}&type=movie`);
			searchResults = await res.json();
			searching = false;
		}, 400);
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-semibold">Movies</h1>
		<p class="mt-1 text-sm text-muted-foreground">{data.movies.length} movies in your library</p>
	</div>
	<Button onclick={() => (searchOpen = true)}>Add movie</Button>
</div>

{#if data.movies.length === 0}
	<div class="mt-4 rounded-lg border border-border bg-card p-12 text-center">
		<p class="text-sm text-muted-foreground">
			No movies yet. <button class="text-primary underline" onclick={() => (searchOpen = true)}
				>Add your first one.</button
			>
		</p>
	</div>
{:else}
	<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.movies as movie (movie.id)}
			{@const meta = movie.movieMetadata as any}
			<a
				href="/movies/{movie.id}"
				class="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
			>
				<p class="leading-snug font-medium">{movie.title}</p>
				<p class="mt-1 text-xs text-muted-foreground">
					{#if meta?.releaseDate}
						{meta.releaseDate.slice(0, 4)}
					{/if}
					· {movie._count.movieLogs} watched
				</p>
			</a>
		{/each}
	</div>
{/if}

<Dialog.Root bind:open={searchOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add movie</Dialog.Title>
		</Dialog.Header>
		<Input
			bind:value={searchQuery}
			oninput={onSearchInput}
			placeholder="Search for a movie..."
			autofocus
		/>
		<div class="mt-2 space-y-1">
			{#if searching}
				<p class="px-1 text-sm text-muted-foreground">Searching…</p>
			{/if}
			{#each searchResults as result (result.tmdbId)}
				<form
					method="POST"
					action="?/add"
					use:enhance={() => {
						return ({ update }) => {
							searchOpen = false;
							update();
						};
					}}
				>
					<input type="hidden" name="tmdbId" value={result.tmdbId} />
					<button
						type="submit"
						class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
					>
						<div class="flex-1">
							<p class="font-medium">{result.title}</p>
							{#if result.year}
								<p class="text-xs text-muted-foreground">{result.year}</p>
							{/if}
						</div>
					</button>
				</form>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
