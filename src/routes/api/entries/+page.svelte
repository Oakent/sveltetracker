<script>
	let { data } = $props();
</script>

<h1>Entries page</h1>

{#each data.entries as { title, duration }}
	<p>{title} - {duration} minutes</p>
{/each}
