<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Welcome back!</h1>
		<p class="text-muted-foreground">Track your language learning content consumption</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Content Entries</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">0</div>
				<p class="text-xs text-muted-foreground">Entries logged this week</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Hours Tracked</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">0</div>
				<p class="text-xs text-muted-foreground">Hours of content consumed</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Current Streak</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">0</div>
				<p class="text-xs text-muted-foreground">Days in a row</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Active Profile</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{data.profiles.find((p: any) => p.id === data.activeProfileId)?.displayName ?? 'None'}
				</div>
				<p class="text-xs text-muted-foreground">
					{data.profiles.find((p: any) => p.id === data.activeProfileId)?.languageCode ?? ''}
				</p>
			</CardContent>
		</Card>
	</div>

	<div class="flex gap-4">
		<Button href="/log/add">Log content</Button>
		<Button href="/log" variant="outline">View all entries</Button>
	</div>
</div>
