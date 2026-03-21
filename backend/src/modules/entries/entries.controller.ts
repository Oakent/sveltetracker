import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EntriesService } from './entries.service';

@Controller('entries')
export class EntriesController {
  constructor(
    private prisma: PrismaService,
    private service: EntriesService,
  ) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }
  @Post()
  create(@Body() body: { title: string; duration: number }) {
    return this.service.create(body);
  }
}
