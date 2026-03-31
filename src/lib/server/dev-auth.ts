import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

function envFlag(value: string | undefined, fallback = false): boolean {
	if (value == null) return fallback;
	return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

const DEFAULT_DEV_USER_ID = '00000000-0000-0000-0000-000000000001';
const DEFAULT_DEV_USER_EMAIL = 'dev@example.com';

export const DEV_BYPASS_AUTH = envFlag(env.DEV_BYPASS_AUTH, dev);
export const DEV_USER_ID = env.DEV_USER_ID || DEFAULT_DEV_USER_ID;
export const DEV_USER_EMAIL = env.DEV_USER_EMAIL || DEFAULT_DEV_USER_EMAIL;
