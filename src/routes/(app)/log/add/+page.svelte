<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formatSeconds } from '$lib/utils/duration';
	let { form } = $props();
	let title = $state('');
	let type = $state('manual');
	let hours = $state('');
	let minutes = $state('');
	let sourceUrl = $state('');
	let speedMultiplier = $state('1.0');
	let submitting = $state(false);
	let enriching = $state(false);
	let enrichError = $state<string | null>(null);

	const today = new Date().toISOString().split('T')[0];

	const hoursNum = $derived(parseInt(hours) || 0);
	const minutesNum = $derived(parseInt(minutes) || 0);
	const totalSeconds = $derived(hoursNum * 3600 + minutesNum * 60);
	const speedMultiplierNum = $derived(parseFloat(speedMultiplier) || 1.0);
	const adjustedSeconds = $derived(
		totalSeconds > 0 && speedMultiplierNum > 0
			? Math.round(totalSeconds / speedMultiplierNum)
			: 0
	);
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

	const YOUTUBE_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
	let enrichTimer: ReturnType<typeof setTimeout>;

	function onSourceUrlInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		sourceUrl = value;
		enrichError = null;
		clearTimeout(enrichTimer);
		if (!YOUTUBE_RE.test(value)) return;
		enrichTimer = setTimeout(() => enrichFromYouTube(value), 600);
	}

	async function enrichFromYouTube(url: string) {
		enriching = true;
		enrichError = null;
		try {
			const res = await fetch('/api/enrich/youtube', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			});
			if (!res.ok) {
				const err = await res.json();
				enrichError = err.message ?? 'Could not fetch video details';
				return;
			}
			const data = await res.json();
			if (!title) title = data.title;
			if (!hoursNum && !minutesNum) {
				hours = String(Math.floor(data.durationSeconds / 3600) || '');
				minutes = String(Math.floor((data.durationSeconds % 3600) / 60) || '');
			}
			type = 'youtube';
		} catch {
			enrichError = 'Could not reach enrichment service';
		} finally {
			enriching = false;
		}
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
		<input type="hidden" name="durationSeconds" value={adjustedSeconds} />
		<input type="hidden" name="speedMultiplier" value={speedMultiplierNum} />
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
				<div class="w-28">
					<Input
						id="speed"
						type="number"
						step="0.05"
						min="0.1"
						bind:value={speedMultiplier}
						placeholder="1.0"
						class="text-center"
					/>
					<p class="mt-1 text-center text-xs text-muted-foreground">Speed</p>
				</div>
			</div>
			{#if isValid}
				{@const original = formatDuration(hoursNum, minutesNum)}
				{@const adjusted = adjustedSeconds > 0 ? formatSeconds(adjustedSeconds) : ''}
				<p class="text-xs text-muted-foreground">
					→ {original}{speedMultiplierNum !== 1.0 ? ` → ${adjusted} at ${speedMultiplierNum}x` : ''}
				</p>
			{/if}
			{#if form?.errors?.duration}
				<p class="text-xs text-destructive">{form.errors.duration}</p>
			{/if}
		</div>

		<div class="space-y-1.5">
			<Label for="loggedAt">Date logged</Label>
			<Input id="loggedAt" name="loggedAt" type="date" value={today} />
		</div>
		<div class="space-y-1.5">
			<Label for="sourceUrl"
				>Source URL <span class="font-normal text-muted-foreground"
					>(optional — paste a YouTube link to auto-fill)</span
				></Label
			>
			<div class="relative">
				<Input
					id="sourceUrl"
					name="sourceUrl"
					type="url"
					value={sourceUrl}
					oninput={onSourceUrlInput}
					placeholder="https://..."
				/>
				{#if enriching}
					<div class="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
						Loading…
					</div>
				{/if}
			</div>
			{#if enrichError}
				<p class="text-xs text-destructive">{enrichError}</p>
			{/if}
		</div>
		<div class="flex items-center justify-between pt-2">
			<Button variant="ghost" href="/log">Cancel</Button>
			<Button type="submit" disabled={submitting || !isValid || !title}>
				{submitting ? 'Saving...' : 'Save entry'}
			</Button>
		</div>
	</form>
</div>
