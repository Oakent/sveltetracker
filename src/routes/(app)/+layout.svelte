<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { page } from '$app/stores';
	import type { User } from '@supabase/supabase-js';

	let { data, children } = $props();

	// Derive a breadcrumb label from the current path
	const routeLabel = $derived(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/log')) return 'Content log';
		if (path.startsWith('/tv')) return 'TV shows';
		if (path.startsWith('/podcasts')) return 'Podcasts';
		if (path.startsWith('/settings')) return 'Settings';
		return 'Dashboard';
	});
</script>

<Sidebar.Provider>
	<AppSidebar
		profiles={data.profiles}
		activeProfileId={data.activeProfileId}
		user={data.user as User}
	/>
	<Sidebar.Inset>
		<header
			class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4"
		>
			<Sidebar.Trigger class="-ms-1" />
			<Separator orientation="vertical" class="me-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Page>{routeLabel()}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-6">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
