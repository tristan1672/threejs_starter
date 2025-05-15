import { Module } from '@nestjs/common';
import { ShapeModule } from 'src/shape/shape.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ShapeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
