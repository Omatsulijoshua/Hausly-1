import { Controller, Post, Get, Body, UseGuards, Request, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateReportDto) {
    return this.reportsService.create(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.reportsService.resolve(id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('listing/:listingId')
  deleteListing(@Param('listingId') listingId: string) {
    return this.reportsService.deleteListing(listingId);
  }
}
