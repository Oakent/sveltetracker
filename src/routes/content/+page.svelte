<script lang="ts">
	let { data } = $props();
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import Navbar from '$lib/components/navbar.svelte';
</script>

<Navbar />

<div class="m-4 flex flex-col items-center justify-center space-y-4">
	<Card.Root class="w-full max-w-md rounded-lg border-2 text-center text-lg">
		<Card.Content>
			<p>Add content</p>
			<form method="POST">
				<Field.Set>
					<Field.Group>
						<Field.Field>
							<Field.Label class="text-base" for="title">Add a title:</Field.Label>
							<Input class="rounded-sm" id="title" name="title" />
						</Field.Field>
						<Field.Field>
							<Field.Label class="text-base" for="duration">Duration (minutes):</Field.Label>
							<Input class="rounded-sm" id="duration" name="duration" type="number" />
						</Field.Field>
						<Field.Field>
							<Button class="rounded-sm" type="submit">Add</Button>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</form>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full max-w-md rounded-lg border text-lg">
		<Card.Content>
			<h2>Entries</h2>
			{#each data.entries as { title, duration, createdAt }}
				<p>{title} - {duration} minutes {createdAt}</p>
			{/each}
		</Card.Content>
	</Card.Root>
</div>
