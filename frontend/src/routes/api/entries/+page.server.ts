import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET() {
  const entries = await prisma.entry.findMany();
  return json(entries);
}

export async function POST({ request }) {
  const data = await request.json();
  const entry = await prisma.entry.create({
    data: {
      title: data.title,
      duration: data.duration,
    },
  });
  return json(entry, { status: 201 });
}