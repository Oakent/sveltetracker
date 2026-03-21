import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.entry.findMany();
  }
  create(data: { title: string; duration: number }) {
    return this.prisma.entry.create({
      data,
    });
  }
}
