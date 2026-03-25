<script>
	let { entries } = $props();
</script>

<h1>Entries page</h1>

<p>{entries.title} {entries.duration}</p>

{#each entries as entry}
	<p>{entry.title} - {entry.duration} minutes</p>
{/each}
