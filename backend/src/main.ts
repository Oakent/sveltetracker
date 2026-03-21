import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { EntriesModule } from './modules/entries/entries.module';

async function bootstrap() {
  console.log('database url:', process.env.DATABASE_URL);
  const app = await NestFactory.create(EntriesModule);
  app.enableCors({
    origin: 'localhost:5173',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
