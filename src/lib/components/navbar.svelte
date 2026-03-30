<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import '../../routes/layout.css';
	import { get } from 'svelte/store';
	import { supabaseStore, sessionStore } from '$lib/stores/supabase';
	import { goto } from '$app/navigation';

	async function logout() {
		const supabase = get(supabaseStore);
		await supabase?.auth.signOut();
		sessionStore.set(null);
		goto('/');
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 items-center justify-between px-4">
		<div class="flex items-center gap-6">
			<a href="/" class="flex items-center space-x-2">
				<span class="text-lg font-bold">Langtracker</span>
			</a>
		</div>
		<div class="flex items-center gap-4">
			{#if $sessionStore}
				<a href="/log" class="text-sm font-medium hover:underline">Content Log</a>
				<Button variant="ghost" size="sm" onclick={logout}>Logout</Button>
			{:else}
				<a href="/login" class="text-sm font-medium hover:underline">Login</a>
				<a href="/signup" class="text-sm font-medium hover:underline">Sign up</a>
			{/if}
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<ModeWatcher />
		</div>
	</div>
</header>
