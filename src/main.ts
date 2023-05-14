import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // uncomment below line of code to test global binding
  // app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();
