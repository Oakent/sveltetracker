<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formatSeconds } from '$lib/utils/duration';
	import type { ContentEntry, ContentType } from '@prisma/client';

	let { data } = $props();

	let filterType = $state<ContentType | 'ALL'>('ALL');
	let deletingId = $state<string | null>(null);

	const filtered = $derived(
		filterType === 'ALL'
			? data.entries
			: data.entries.filter((e: ContentEntry) => e.type === filterType)
	);

	const typeOptions: { value: ContentType | 'ALL'; label: string }[] = [
		{ value: 'ALL', label: 'All types' },
		{ value: 'manual', label: 'Manual' },
		{ value: 'youtube', label: 'YouTube' },
		{ value: 'podcast', label: 'Podcast' },
		{ value: 'tv_episode', label: 'TV Episode' },
		{ value: 'movie', label: 'Movie' }
	];

	const typeBadgeVariant: Record<string, string> = {
		ALL: 'secondary',
		manual: 'secondary',
		youtube: 'destructive',
		podcast: 'outline',
		tv_episode: 'default'
	};
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-semibold">Content log</h1>
		<p class="mt-1 text-sm text-muted-foreground">{data.entries.length} entries logged</p>
	</div>
	<div class="flex items-center gap-2">
		<Select.Root type="single" bind:value={filterType}>
			<Select.Trigger class="w-36">
				{typeOptions.find((o) => o.value === filterType)?.label ?? 'All types'}
			</Select.Trigger>
			<Select.Content>
				{#each typeOptions as opt (opt.value)}
					<Select.Item value={opt.value}>{opt.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Button href="/log/add">Add entry</Button>
	</div>
</div>

{#if filtered.length === 0}
	<div class="mt-4 rounded-lg border border-border bg-card p-12 text-center">
		<p class="text-sm text-muted-foreground">
			No entries yet. <a href="/log/add" class="text-primary underline">Add your first one.</a>
		</p>
	</div>
{:else}
	<div class="mt-4 rounded-lg border border-border bg-card">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>Type</Table.Head>
					<Table.Head>Duration</Table.Head>
					<Table.Head>Logged</Table.Head>
					<Table.Head class="w-24"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filtered as entry (entry.id)}
					<Table.Row>
						<Table.Cell class="font-medium">
							{entry.title}
							{#if entry.sourceUrl}
								<a
									href={entry.sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="ml-1 text-xs text-muted-foreground hover:underline">↗</a
								>
							{/if}
						</Table.Cell>
						<Table.Cell>
							<Badge variant={typeBadgeVariant[entry.type] as any}>
								{entry.type.replace('_', ' ').toLowerCase()}
							</Badge>
						</Table.Cell>
						<Table.Cell class="text-sm text-muted-foreground">
							{formatSeconds(entry.durationSeconds)}
						</Table.Cell>
						<Table.Cell class="text-sm text-muted-foreground">
							{new Date(entry.loggedAt).toLocaleDateString()}
						</Table.Cell>
						<Table.Cell>
							<div class="flex items-center gap-1">
								<Button variant="ghost" size="sm" href="/log/{entry.id}/edit">Edit</Button>
								<Button
									variant="ghost"
									size="sm"
									class="text-destructive hover:text-destructive"
									onclick={() => (deletingId = entry.id)}
								>
									Delete
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}

<!-- Delete confirmation dialog -->
<AlertDialog.Root
	open={deletingId !== null}
	onOpenChange={(o) => {
		if (!o) deletingId = null;
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete this entry?</AlertDialog.Title>
			<AlertDialog.Description>This can't be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return ({ update }) => {
						deletingId = null;
						update();
					};
				}}
			>
				<input type="hidden" name="id" value={deletingId} />
				<AlertDialog.Action
					type="submit"
					class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
				>
					Delete
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
