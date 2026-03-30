// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PrismaClient } from '@prisma/client/extension';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
	var prisma: PrismaClient;
}

export {};
