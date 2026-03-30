<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import Navbar from '$lib/components/navbar.svelte';
	import LoginForm from '$lib/components/login-form.svelte';

	let { data } = $props();
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let message = $state('');

	async function signUp() {
		loading = true;
		error = '';
		const { error: e } = await data.supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${location.origin}/auth/callback` }
		});
		if (e) error = e.message;
		else message = 'Check your email to confirm your account';
		loading = false;
	}

	async function signInWithGoogle() {
		await data.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${location.origin}/auth/callback` }
		});
	}
</script>

<Navbar />
<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm
		mode="signup"
		{email}
		{password}
		{loading}
		{error}
		{message}
		onEmailChange={(v) => (email = v)}
		onPasswordChange={(v) => (password = v)}
		onSubmit={signUp}
		onGoogle={signInWithGoogle}
	/>
</div>
