import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('entries')
export class EntriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    return this.prisma.entry.findMany();
  }
}
