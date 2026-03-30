<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let { form } = $props();

	let title = $state('');
	let type = $state('manual');
	let hours = $state('');
	let minutes = $state('');
	let sourceUrl = $state('');
	let submitting = $state(false);

	const hoursNum = $derived(parseInt(hours) || 0);
	const minutesNum = $derived(parseInt(minutes) || 0);
	const totalSeconds = $derived(hoursNum * 3600 + minutesNum * 60);
	const isValid = $derived(hoursNum > 0 || minutesNum > 0);

	const typeOptions = [
		{ value: 'manual', label: 'Manual entry' },
		{ value: 'youtube', label: 'YouTube video' },
		{ value: 'podcast', label: 'Podcast episode' },
		{ value: 'tv_episode', label: 'TV episode' }
	];

	function formatDuration(h: number, m: number): string {
		const parts = [];
		if (h > 0) parts.push(`${h}h`);
		if (m > 0) parts.push(`${m}m`);
		return parts.join(' ') || '';
	}
</script>

<div class="mx-auto max-w-lg">
	<div class="mb-6">
		<h1 class="text-2xl font-semibold">Add entry</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Log content you've consumed in your target language.
		</p>
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
		<input type="hidden" name="durationSeconds" value={totalSeconds} />

		<div class="space-y-1.5">
			<Label for="title">Title</Label>
			<Input
				id="title"
				name="title"
				bind:value={title}
				placeholder="e.g. My Neighbour Totoro"
				required
				aria-invalid={form?.errors?.title ? true : undefined}
			/>
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
			<div class="flex items-center gap-2">
				<div class="flex-1">
					<Input
						id="hours"
						type="number"
						min="0"
						bind:value={hours}
						placeholder="0"
						class="text-center"
					/>
					<p class="mt-1 text-center text-xs text-muted-foreground">Hours</p>
				</div>
				<div class="flex-1">
					<Input
						id="minutes"
						type="number"
						min="0"
						bind:value={minutes}
						placeholder="0"
						class="text-center"
					/>
					<p class="mt-1 text-center text-xs text-muted-foreground">Minutes</p>
				</div>
			</div>
			{#if isValid}
				<p class="text-xs text-muted-foreground">→ {formatDuration(hoursNum, minutesNum)}</p>
			{/if}
			{#if form?.errors?.duration}
				<p class="text-xs text-destructive">{form.errors.duration}</p>
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
			<Button type="submit" disabled={submitting || !isValid || !title}>
				{submitting ? 'Saving...' : 'Save entry'}
			</Button>
		</div>
	</form>
</div>
