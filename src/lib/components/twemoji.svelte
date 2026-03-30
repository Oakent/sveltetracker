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
			size: `${size}x${size}`
		})
	);
</script>

<span class={className}>
	{@html parsedHtml}
</span>
