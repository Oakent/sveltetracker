<script lang="ts">
	import * as Field from '$lib/components/ui/field/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
</script>

<h1>Page to add content to langtracker</h1>
<div class="w-full max-w-md">
	<Field.Set>
		<Field.Label for="title">Title</Field.Label>
		<Input type="text" id="title" name="title" />
		<Field.Label for="duration">Duration (minutes)</Field.Label>
		<Input type="number" id="duration" name="duration" />
		<Button type="submit">Add</Button>
	</Field.Set>
</div>
