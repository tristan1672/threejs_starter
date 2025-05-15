import { Provider } from '@nestjs/common';
import * as amqp from 'amqplib';

/*

run rabbitmq:

docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

*/

export const RabbitMQProvider: Provider = {
  provide: 'RABBITMQ_CHANNEL',
  useFactory: async () => {
    try {
      const connection = await amqp.connect('amqp://localhost:5672');
      console.log('Connected to RabbitMQ');
      const channel = await connection.createChannel();
      await channel.assertExchange('scene.events', 'topic', { durable: false });
      console.log('Exchange asserted');

      return channel;
    } catch (err) {
      console.error('RabbitMQ connection failed:', err.message);
      return null; // allow app to boot without RabbitMQ
    }
  },
};
