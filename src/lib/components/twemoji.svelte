<script lang="ts">
	import twemoji from 'twemoji';

	let {
		emoji,
		size = 24,
		class: className = ''
	}: {
		emoji: string;
		size?: number;
		class?: string;
	} = $props();

	const parsedHtml = $derived(
		twemoji.parse(emoji, {
			base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
			ext: '.png',
			size: '72x72'
		})
	);
</script>

<span
	class={className}
	style="width: {size}px; height: {size}px; display: inline-flex; align-items: center; justify-content: center;"
>
	<!-- svelte-ignore a11y_interesting_non_elements_with_interactive_events_have_interactive_roles -->
	{@html parsedHtml}
</span>

<style>
	:global(span img.emoji) {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
