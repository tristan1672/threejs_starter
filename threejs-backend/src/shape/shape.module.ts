import { Module } from '@nestjs/common';
import { ShapeService } from './shape.service';
import { ShapeController } from './shape.controller';
import { RabbitMQProvider } from 'src/rabbitmq.provider';

@Module({
  controllers: [ShapeController],
  providers: [ShapeService, RabbitMQProvider],
})
export class ShapeModule {}
