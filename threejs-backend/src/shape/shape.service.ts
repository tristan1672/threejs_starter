import { Injectable, Inject } from '@nestjs/common';
import { Channel } from 'amqplib';
import { UpdateDto } from './dto/update-color.dto';

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

  publishColor(UpdateDto: UpdateDto) {
    const { color } = UpdateDto;
    const { type } = UpdateDto;
    const routingKey = `scene.color.updated.${type}.${color}`;
    console.log(
      `[Publish Color] Routing Key: ${routingKey}, Payload: ${JSON.stringify({ color })}`,
    );
    this.channel.publish(
      'scene.events', // exchange name
      routingKey, // routing key
      Buffer.from(JSON.stringify({ type, color })),
    );
  }

  publishShape(UpdateDto: UpdateDto) {
    const { color } = UpdateDto;
    const { type } = UpdateDto;
    const routingKey = `scene.shape.updated.${type}.${color}`;
    console.log(
      `[Publish Shape] Routing Key: ${routingKey}, Payload: ${JSON.stringify({ type })}`,
    );

    this.channel.publish(
      'scene.events', // exchange name
      routingKey, // routing key
      Buffer.from(JSON.stringify({ type, color })),
    );
  }
}
