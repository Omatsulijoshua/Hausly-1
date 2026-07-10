import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        userId,
        listingId: dto.listingId,
        reason: dto.reason,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolve(id: string) {
    return this.prisma.report.delete({
      where: { id },
    });
  }

  async deleteListing(listingId: string) {
    return this.prisma.listing.delete({
      where: { id: listingId },
    });
  }
}
