import { Provider } from '@nestjs/common';
import * as amqp from 'amqplib';

export const RabbitMQProvider: Provider = {
  provide: 'RABBITMQ_CHANNEL',
  useFactory: async () => {
    try {
      const connection = await amqp.connect('amqp://rabbitmq');
      console.log('Connected to RabbitMQ');
      const channel = await connection.createChannel();
      await channel.assertExchange('scene.events', 'topic', { durable: false });
      console.log('Exchange asserted');

      // Optional: handle app shutdown
      process.on('SIGINT', async () => {
        await channel.close();
        await connection.close();
      });

      return channel;
    } catch (err) {
      console.error('RabbitMQ connection failed:', err.message);
      return null; // allow app to boot without RabbitMQ
    }
  },
};
