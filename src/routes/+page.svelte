<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		if (data.session) {
			goto('/dashboard');
		}
	});
</script>

<div class="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
	<h1 class="mb-4 text-4xl font-bold tracking-tight">Langtracker</h1>
	<p class="mb-8 text-lg text-muted-foreground">
		Track comprehensible input language learning, with multi-language profiles.
	</p>
	<div class="flex gap-4">
		<a
			href="/login"
			class="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
		>
			Sign in
		</a>
		<a
			href="/signup"
			class="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
		>
			Sign up
		</a>
	</div>
</div>
