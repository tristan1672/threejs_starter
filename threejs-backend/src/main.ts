import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app/app.module';
import amqp from 'amqplib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // or '*' for all origins (less secure)
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
  });

  //const channel = await connectToRabbitMQ();

  await app.listen(3001);
  console.log('Initialized');
}

bootstrap();
