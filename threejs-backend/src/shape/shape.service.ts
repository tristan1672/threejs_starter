import { Injectable, Inject } from '@nestjs/common';
import { Channel } from 'amqplib';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ShapeService {
  findAll() {
    return `This action returns all shape`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shape`;
  }

  update(id: number) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }

  constructor(@Inject('RABBITMQ_CHANNEL') private readonly channel: Channel) {}

  publishColor(UpdateColorDto: UpdateColorDto) {
    const { color } = UpdateColorDto;
    const routingKey = `color.changed.${color}`;

    this.channel.publish(
      'scene.events', // exchange name
      routingKey, // routing key
      Buffer.from(JSON.stringify({ color })),
    );
  }
}
