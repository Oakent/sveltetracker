import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEV_USER_ID = process.env.DEV_USER_ID || '00000000-0000-0000-0000-000000000001';
const DEV_USER_EMAIL = process.env.DEV_USER_EMAIL || 'dev@example.com';

try {
  await prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: { email: DEV_USER_EMAIL },
    create: { id: DEV_USER_ID, email: DEV_USER_EMAIL }
  });

  const existing = await prisma.languageProfile.findFirst({
    where: { userId: DEV_USER_ID }
  });

  if (!existing) {
    await prisma.languageProfile.create({
      data: {
        userId: DEV_USER_ID,
        languageCode: 'es',
        displayName: 'Spanish'
      }
    });
  }

  console.log('Dev user/profile ready');
} finally {
  await prisma.$disconnect();
}