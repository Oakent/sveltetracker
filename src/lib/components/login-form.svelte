<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		Field,
		FieldGroup,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';

	type Props = {
		mode: 'login' | 'signup';
		email: string;
		password: string;
		loading: boolean;
		error: string;
		message: string;
		onEmailChange: (v: string) => void;
		onPasswordChange: (v: string) => void;
		onSubmit: () => void;
		onMagicLink?: () => void;
		onGoogle?: () => void;
	};

	let {
		mode,
		email,
		password,
		loading,
		error,
		message,
		onEmailChange,
		onPasswordChange,
		onSubmit,
		onMagicLink,
		onGoogle
	}: Props = $props();

	const id = $props.id();
	const isLogin = mode === 'login';
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">{isLogin ? 'Login' : 'Create an account'}</Card.Title>
		<Card.Description>
			{isLogin
				? 'Enter your email below to login to your account'
				: 'Enter your details below to create your account'}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
		>
			<FieldGroup>
				<Field>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input
						id="email-{id}"
						type="email"
						placeholder="m@example.com"
						value={email}
						oninput={(e) => onEmailChange(e.currentTarget.value)}
						required
					/>
				</Field>
				<Field>
					<div class="flex items-center">
						<FieldLabel for="password-{id}">Password</FieldLabel>
						{#if isLogin}
							<a href="/forgot-password" class="ms-auto inline-block text-sm underline">
								Forgot your password?
							</a>
						{/if}
					</div>
					<Input
						id="password-{id}"
						type="password"
						value={password}
						oninput={(e) => onPasswordChange(e.currentTarget.value)}
						required
					/>
				</Field>

				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}
				{#if message}
					<p class="text-sm text-muted-foreground">{message}</p>
				{/if}

				<Field>
					<Button type="submit" class="w-full" disabled={loading}>
						{loading ? 'Loading...' : isLogin ? 'Login' : 'Create account'}
					</Button>

					{#if isLogin && onMagicLink}
						<Button
							type="button"
							variant="outline"
							class="w-full"
							onclick={onMagicLink}
							disabled={loading}
						>
							Sign in with magic link
						</Button>
					{/if}

					{#if onGoogle}
						<Button
							type="button"
							variant="outline"
							class="w-full"
							onclick={onGoogle}
							disabled={loading}
						>
							Continue with Google
						</Button>
					{/if}

					<FieldDescription class="text-center">
						{#if isLogin}
							Don't have an account? <a href="/signup" class="underline">Sign up</a>
						{:else}
							Already have an account? <a href="/login" class="underline">Login</a>
						{/if}
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
