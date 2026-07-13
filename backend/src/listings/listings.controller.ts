import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ListingStatus } from '@prisma/client';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.listingsService.findAll(filters);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get listings near a specific location' })
  async findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.listingsService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Request() req: any,
    @Body() createData: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const response = await this.cloudinaryService.uploadFile(file);
        imageUrls.push(response.secure_url);
      }
    }
    
    return this.listingsService.create(req.user.sub, {
      ...createData,
      imageUrls,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async adminFindAll(@Query() filters: any) {
    return this.listingsService.adminFindAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ListingStatus,
  ) {
    return this.listingsService.updateStatus(id, status);
  }
}
