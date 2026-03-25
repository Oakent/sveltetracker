<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<h1>Page to add content to langtracker</h1>

<Card.Root class="w-full max-w-md rounded-lg border">
	<Card.Content class="p-6">
		<Field.Set>
			<Field.Group>
				<Field.Field>
					<Field.Label for="title">Add a title</Field.Label>
					<Input id="title" name="title" />
				</Field.Field>
				<Field.Field>
					<Field.Label for="duration">Duration (minutes)</Field.Label>
					<Input id="duration" name="duration" type="number" />
				</Field.Field>
				<Field.Field>
					<Button type="submit">Add</Button>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Card.Content>
</Card.Root>
