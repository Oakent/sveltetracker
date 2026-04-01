<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { COMMON_LANGUAGES, type Language } from '$lib/data/languages';
	import Twemoji from '$lib/components/twemoji.svelte';

	let { data } = $props();

	let searchQuery = $state('');
	let showDropdown = $state(false);
	let selectedLanguage = $state<Language | null>(null);
	let editingId = $state<string | null>(null);
	let editingName = $state('');

	const existingLanguageCodes = $derived(new Set(data.profiles.map((p) => p.languageCode)));

	const filteredLanguages = $derived(
		COMMON_LANGUAGES.filter(
			(lang) =>
				!existingLanguageCodes.has(lang.code) &&
				(lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					lang.code.toLowerCase().includes(searchQuery.toLowerCase()))
		).slice(0, 10)
	);

	function selectLanguage(lang: Language) {
		selectedLanguage = lang;
		searchQuery = '';
		showDropdown = false;
	}

	async function setActiveProfile(profileId: string) {
		const formData = new FormData();
		formData.append('profileId', profileId);
		await fetch('/api/profiles/active', {
			method: 'PATCH',
			body: formData
		});
		await invalidateAll();
	}

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	}

	function startEditing(profile: { id: string; displayName: string }) {
		editingId = profile.id;
		editingName = profile.displayName;
	}

	function cancelEditing() {
		editingId = null;
		editingName = '';
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Language Profiles</h1>
		<p class="text-muted-foreground">Manage your language learning profiles</p>
		{#if data.redirectReason === 'required' && data.redirectPage}
			<p class="mt-2 text-sm text-orange-600">
				You do not currently have any language profiles. Please create one to access {data.redirectPage}.
			</p>
		{:else if data.redirectReason === 'new'}
			<p class="mt-2 text-sm text-orange-600">
				Welcome! Please create a language profile to get started.
			</p>
		{/if}
	</div>

	<div class="rounded-lg border border-border bg-card p-6">
		<h2 class="mb-4 text-lg font-semibold">Add a new language</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						selectedLanguage = null;
						await invalidateAll();
					}
					update();
				};
			}}
			class="space-y-4"
		>
			<div class="relative">
				<label class="text-sm font-medium" for="language-search">Search language</label>
				<Input
					id="language-search"
					type="text"
					placeholder="Search for a language..."
					bind:value={searchQuery}
					onfocus={() => (showDropdown = true)}
					onblur={() => setTimeout(() => (showDropdown = false), 200)}
				/>
				{#if showDropdown && filteredLanguages.length > 0}
					<div
						class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-md"
					>
						{#each filteredLanguages as lang (lang.code)}
							<button
								type="button"
								class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent"
								onclick={() => selectLanguage(lang)}
							>
								<Twemoji emoji={lang.flag} size={20} />
								<span>{lang.name}</span>
								<span class="ml-auto text-xs text-muted-foreground">{lang.code}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if selectedLanguage}
				<input type="hidden" name="languageCode" value={selectedLanguage.code} />
				<input type="hidden" name="displayName" value={selectedLanguage.name} />
				<div class="flex items-center gap-2 rounded-md bg-accent/50 p-3">
					<Twemoji emoji={selectedLanguage.flag} size={32} />
					<span class="font-medium">{selectedLanguage.name}</span>
				</div>
			{/if}

			<Button type="submit" disabled={!selectedLanguage}>Add Language</Button>
		</form>
	</div>

	<div class="space-y-4">
		<h2 class="text-lg font-semibold">Your Languages</h2>
		{#if data.profiles.length === 0}
			<div class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
				<p>No languages added yet.</p>
				<p class="text-sm">Add your first language above to get started!</p>
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.profiles as profile (profile.id)}
					{@const isActive = profile.id === data.activeProfileId}
					<div class="group">
						{#if editingId === profile.id}
							<div
								class="rounded-lg border border-border p-4 transition-colors {isActive
									? 'border-primary bg-accent/50'
									: ''}"
							>
								<form
									method="POST"
									action="?/update"
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success') {
												editingId = null;
												editingName = '';
												await invalidateAll();
											}
											update();
										};
									}}
									class="space-y-2"
								>
									<input type="hidden" name="id" value={profile.id} />
									<Input name="displayName" bind:value={editingName} class="h-8" />
									<div class="flex gap-2">
										<Button type="submit" size="sm" class="h-8">Save</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											class="h-8"
											onclick={cancelEditing}
										>
											Cancel
										</Button>
									</div>
								</form>
							</div>
						{:else}
							<button
								type="button"
								onclick={() => !isActive && setActiveProfile(profile.id)}
								class="w-full text-left"
							>
								<div
									class="rounded-lg border p-4 transition-colors {isActive
										? 'border-primary bg-accent/50'
										: 'border-border hover:border-primary/50'}"
								>
									<div class="flex items-start gap-3">
										<Twemoji
											emoji={COMMON_LANGUAGES.find((l) => l.code === profile.languageCode)?.flag ??
												'🌐'}
											size={48}
										/>
										<div class="flex-1">
											<h3 class="font-medium">{profile.displayName}</h3>
											<p class="text-sm text-muted-foreground">
												{formatTime(profile.totalSeconds)} logged
											</p>
										</div>
										{#if isActive}
											<span
												class="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
											>
												Active
											</span>
										{/if}
									</div>
								</div>
							</button>
							<div
								class="mt-1 flex gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="h-8"
									onclick={() => startEditing(profile)}
								>
									Edit
								</Button>
								{#if data.profiles.length > 1}
									<form
										method="POST"
										action="?/delete"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type === 'success') {
													await invalidateAll();
												}
												update();
											};
										}}
									>
										<input type="hidden" name="id" value={profile.id} />
										<Button
											type="submit"
											variant="ghost"
											size="sm"
											class="h-8 text-destructive hover:text-destructive"
										>
											Delete
										</Button>
									</form>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
