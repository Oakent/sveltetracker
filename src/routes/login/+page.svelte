<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { get } from 'svelte/store';
	import Navbar from '$lib/components/navbar.svelte';
	import LoginForm from '$lib/components/login-form.svelte';
	import { supabaseStore } from '$lib/stores/supabase';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let message = $state('');

	async function signInWithPassword() {
		loading = true;
		error = '';
		const supabase = get(supabaseStore);
		const { error: e } = await supabase!.auth.signInWithPassword({ email, password });
		if (e) error = e.message;
		else {
			await invalidate('supabase:auth');
			goto('/dashboard');
		}
		loading = false;
	}

	async function signInWithMagicLink() {
		loading = true;
		error = '';
		const supabase = get(supabaseStore);
		const { error: e } = await supabase!.auth.signInWithOtp({
			email,
			options: { emailRedirectTo: `${location.origin}/auth/callback` }
		});
		if (e) error = e.message;
		else message = 'Check your email for a login link';
		loading = false;
	}

	async function signInWithGoogle() {
		const supabase = get(supabaseStore);
		await supabase!.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${location.origin}/auth/callback` }
		});
	}
</script>

<head>
	<title>Login</title>
</head>

<Navbar />
<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm
		mode="login"
		{email}
		{password}
		{loading}
		{error}
		{message}
		onEmailChange={(v) => (email = v)}
		onPasswordChange={(v) => (password = v)}
		onSubmit={signInWithPassword}
		onMagicLink={signInWithMagicLink}
		onGoogle={signInWithGoogle}
	/>
</div>
