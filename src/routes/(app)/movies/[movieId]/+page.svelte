<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();

	const meta = data.movie.movieMetadata as any;
</script>

<div class="mb-6 flex items-start justify-between">
	<div>
		<h1 class="text-2xl font-semibold">{data.movie.title}</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			{#if meta?.releaseDate}
				{meta.releaseDate.slice(0, 4)}
			{/if}
		</p>
	</div>
	<Button variant="ghost" href="/movies">Back</Button>
</div>

<div class="rounded-lg border border-border bg-card p-6">
	{#if meta?.posterPath}
		<img
			src={`https://image.tmdb.org/t/p/w500${meta.posterPath}`}
			alt={data.movie.title}
			class="mb-4 max-w-[200px] rounded"
		/>
	{/if}

	{#if meta?.overview}
		<p class="mb-4 text-sm text-muted-foreground">{meta.overview}</p>
	{/if}

	<form
		method="POST"
		action="?/toggle"
		use:enhance={() => {
			return ({ result, update }) => {
				update({ reset: false });
			};
		}}
	>
		<Button type="submit" variant={data.watched ? 'secondary' : 'default'}>
			{data.watched ? 'Watched ✓' : 'Mark as watched'}
		</Button>
	</form>
</div>
