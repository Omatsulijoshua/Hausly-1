import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any) {
    const { propertyType, minPrice, maxPrice, rooms, search } = filters;

    return this.prisma.listing.findMany({
      where: {
        status: ListingStatus.APPROVED,
        propertyType: propertyType,
        price: {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        },
        rooms: rooms ? parseInt(rooms) : undefined,
        OR: search ? [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      include: {
        images: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    // Simple bounding box approximation (1 degree is approx 111km)
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));

    return this.prisma.listing.findMany({
      where: {
        status: ListingStatus.APPROVED,
        latitude: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        longitude: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      },
      include: {
        images: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async create(userId: string, data: any) {
    const { imageUrls, ...listingData } = data;

    return this.prisma.listing.create({
      data: {
        ...listingData,
        price: typeof listingData.price === 'string' ? parseFloat(listingData.price) : listingData.price,
        rooms: typeof listingData.rooms === 'string' ? parseInt(listingData.rooms) : listingData.rooms,
        latitude: typeof listingData.latitude === 'string' ? parseFloat(listingData.latitude) : (listingData.latitude || 0),
        longitude: typeof listingData.longitude === 'string' ? parseFloat(listingData.longitude) : (listingData.longitude || 0),
        userId,
        status: ListingStatus.PENDING,
        images: {
          create: imageUrls ? imageUrls.map((url: string) => ({ url })) : [],
        },
      },
      include: {
        images: true,
      },
    });
  }
}
