<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import NavigationMenuItem from './ui/navigation-menu/navigation-menu-item.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import '../../routes/layout.css';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex justify-between">
	<div>
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenuItem>
					<NavigationMenu.Link href="/">Home</NavigationMenu.Link>
				</NavigationMenuItem>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Content</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link href="/content">Add</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
	<div class="justify-self-end">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenuItem>
					<NavigationMenu.Link href="/login">Login</NavigationMenu.Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<ModeWatcher />
					<Button
						onclick={toggleMode}
						variant="outline"
						size="icon"
						class="justify-self-end rounded-sm"
					>
						<SunIcon
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
					<ModeWatcher />
				</NavigationMenuItem>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
</div>
