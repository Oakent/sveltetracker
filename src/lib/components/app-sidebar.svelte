<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { invalidateAll, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { sessionStore } from '$lib/stores/supabase';
	import Twemoji from '$lib/components/twemoji.svelte';
	import { COMMON_LANGUAGES } from '$lib/data/languages';
	import type { LanguageProfile } from '@prisma/client';

	let {
		profiles,
		activeProfileId,
		user
	}: {
		profiles: LanguageProfile[];
		activeProfileId: string | null;
		user: { email?: string };
	} = $props();

	const sortedProfiles = $derived(
		[...profiles].sort((a, b) => {
			if (a.id === activeProfileId) return -1;
			if (b.id === activeProfileId) return 1;
			return 0;
		})
	);
	const recentProfiles = $derived(sortedProfiles.slice(0, 3));
	const activeProfile = $derived(profiles.find((p) => p.id === activeProfileId) ?? profiles[0]);

	const navItems = [
		{ label: 'Dashboard', href: '/dashboard' },
		{ label: 'Content log', href: '/log' },
		{ label: 'TV shows', href: '/tv' },
		{ label: 'Podcasts', href: '/podcasts' }
	];

	async function switchProfile(id: string) {
		const formData = new FormData();
		formData.append('profileId', id);
		await fetch('/api/profiles/active', {
			method: 'PATCH',
			body: formData
		});
		await invalidateAll();
	}
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<!-- Language profile switcher -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Twemoji
									emoji={activeProfile
										? (COMMON_LANGUAGES.find((l) => l.code === activeProfile.languageCode)?.flag ??
											'🌐')
										: '🌐'}
									size={32}
								/>
								<div class="flex flex-col gap-0.5 leading-none">
									<span class="font-medium">{activeProfile?.displayName ?? 'Select language'}</span>
									<span class="text-xs text-muted-foreground"
										>{activeProfile?.languageCode ?? ''}</span
									>
								</div>
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56" align="start">
						<DropdownMenu.Label>Language profiles</DropdownMenu.Label>
						<DropdownMenu.Separator />
						{#each recentProfiles as profile (profile.id)}
							<DropdownMenu.Item
								onclick={() => switchProfile(profile.id)}
								class="flex items-center gap-2"
							>
								<Twemoji
									emoji={COMMON_LANGUAGES.find((l) => l.code === profile.languageCode)?.flag ??
										'🌐'}
									size={20}
								/>
								{profile.displayName}
								{#if profile.id === activeProfileId}
									<span class="ml-auto text-xs text-primary">Active</span>
								{/if}
							</DropdownMenu.Item>
						{/each}
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={() => goto('/settings/languages')}>
							Manage languages
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navItems as item (item.href)}
						<Sidebar.MenuItem>
							<a
								href={item.href}
								class="flex h-8 items-center gap-2 overflow-hidden rounded-md px-2 text-xs text-sidebar-foreground transition-[width,height,padding] group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
								class:bg-sidebar-accent={$page.url.pathname === item.href ||
									($page.url.pathname.startsWith(item.href) && item.href !== '/')}
								class:text-sidebar-accent-foreground={$page.url.pathname === item.href ||
									($page.url.pathname.startsWith(item.href) && item.href !== '/')}
							>
								{item.label}
							</a>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props} size="lg">
								<div
									class="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
								>
									{user.email?.[0].toUpperCase() ?? '?'}
								</div>
								<span class="truncate text-sm">{user.email ?? 'User'}</span>
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-48">
						<DropdownMenu.Item onclick={() => goto('/settings/languages')}
							>Settings</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							onclick={async () => {
								await fetch('/auth/logout', { method: 'POST' });
								sessionStore.set(null);
								await invalidateAll();
								goto('/');
							}}
						>
							Sign out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
