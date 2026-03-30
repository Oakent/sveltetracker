<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/navbar.svelte';

	let { data, children } = $props();

	const isAuthenticated = $derived(!!data.session);
</script>

{#if isAuthenticated}
	{@render children()}
{:else}
	<main class="min-h-screen">
		{@render children()}
	</main>
{/if}
