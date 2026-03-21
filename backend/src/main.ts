import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { EntriesModule } from './modules/entries/entries.module';

async function bootstrap() {
  const app = await NestFactory.create(EntriesModule);
  app.enableCors({
    origin: 'localhost:5173',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
