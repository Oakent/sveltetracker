<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { parseDurationInput, formatSeconds, secondsToDurationString } from '$lib/utils/duration';

	let { data, form } = $props();

	// Pre-fill from the loaded entry, converting seconds back to a readable string
	let title = $state(data.entry.title);
	let type = $state(data.entry.type);
	let durationInput = $state(secondsToDurationString(data.entry.durationSeconds));
	let sourceUrl = $state(data.entry.sourceUrl ?? '');
	let submitting = $state(false);

	const parsedSeconds = $derived(parseDurationInput(durationInput));
	const durationPreview = $derived(
		parsedSeconds !== null
			? formatSeconds(parsedSeconds)
			: durationInput.length > 0
				? 'Invalid format'
				: ''
	);

	const typeOptions = [
		{ value: 'manual', label: 'Manual entry' },
		{ value: 'youtube', label: 'YouTube video' },
		{ value: 'podcast', label: 'Podcast episode' },
		{ value: 'tv_episode', label: 'TV episode' },
		{ value: 'movie', label: 'Movie' },
		{ value: 'audiobook', label: 'Audiobook' },
		{ value: 'other', label: 'Other' }
	];
</script>

<div class="mx-auto max-w-lg">
	<div class="mb-6">
		<h1 class="text-2xl font-semibold">Edit entry</h1>
	</div>

	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			return ({ update }) => {
				submitting = false;
				update();
			};
		}}
		class="space-y-5 rounded-lg border border-border bg-card p-6"
	>
		<input type="hidden" name="durationSeconds" value={parsedSeconds ?? ''} />

		<div class="space-y-1.5">
			<Label for="title">Title</Label>
			<Input id="title" name="title" bind:value={title} required />
			{#if form?.errors?.title}
				<p class="text-xs text-destructive">{form.errors.title}</p>
			{/if}
		</div>

		<div class="space-y-1.5">
			<Label for="type">Type</Label>
			<Select.Root type="single" bind:value={type} name="type">
				<Select.Trigger id="type" class="w-full">
					{typeOptions.find((o) => o.value === type)?.label ?? 'Select type'}
				</Select.Trigger>
				<Select.Content>
					{#each typeOptions as opt (opt.value)}
						<Select.Item value={opt.value}>{opt.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="space-y-1.5">
			<Label for="duration">Duration</Label>
			<Input id="duration" bind:value={durationInput} placeholder="1h 23m or 83" />
			{#if durationPreview}
				<p class="text-xs text-muted-foreground">
					{durationPreview === 'Invalid format'
						? '⚠ Use "1h 30m", "90m", or seconds'
						: `→ ${durationPreview}`}
				</p>
			{/if}
		</div>

		<div class="space-y-1.5">
			<Label for="sourceUrl"
				>Source URL <span class="font-normal text-muted-foreground">(optional)</span></Label
			>
			<Input
				id="sourceUrl"
				name="sourceUrl"
				type="url"
				bind:value={sourceUrl}
				placeholder="https://..."
			/>
		</div>

		<div class="flex items-center justify-between pt-2">
			<Button variant="ghost" href="/log">Cancel</Button>
			<Button type="submit" disabled={submitting || parsedSeconds === null || !title}>
				{submitting ? 'Saving...' : 'Save changes'}
			</Button>
		</div>
	</form>
</div>
