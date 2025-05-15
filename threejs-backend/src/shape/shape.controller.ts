import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShapeService } from './shape.service';
import { UpdateShapeDto } from './dto/update-shape.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('shape')
export class ShapeController {
  constructor(private readonly shapeService: ShapeService) {}

  @Get()
  findAll() {
    return this.shapeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shapeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shapeService.remove(+id);
  }

  @Patch('color')
  changeColor(@Body() body: UpdateColorDto) {
    console.log(`Color changed to: ${body.color}`);
    this.shapeService.publishColor(body);
    return { success: true };
  }

  @Patch('type')
  changeShape(@Body() body: UpdateShapeDto) {
    console.log(`Shape changed to: ${body.type}`);
    return { success: true };
  }
}
