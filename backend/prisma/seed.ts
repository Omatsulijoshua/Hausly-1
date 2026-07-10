import 'dotenv/config';
import { PrismaClient, UserStatus, ListingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const password = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hausly.com',
      password,
      name: 'Admin Hausly',
      role: 'ADMIN',
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });

  const landlord = await prisma.user.create({
    data: {
      email: 'landlord@hausly.com',
      password,
      name: 'John Landlord',
      role: 'LANDLORD',
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      email: 'tenant@hausly.com',
      password,
      name: 'Sarah Tenant',
      role: 'TENANT',
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });

  console.log('Seeding listings...');
  const listings = [
    { title: 'Modern Loft in Downtown', price: 2500, type: 'APARTMENT', address: '123 Main St, New York', rooms: 2 },
    { title: 'Cozy Beach House', price: 3200, type: 'HOUSE', address: '456 Ocean Ave, Miami', rooms: 3 },
    { title: 'Luxury Villa with Pool', price: 8500, type: 'VILLA', address: '789 Palm Dr, Los Angeles', rooms: 5 },
    { title: 'Compact Studio Near Subway', price: 1800, type: 'APARTMENT', address: '101 City Rd, Chicago', rooms: 1 },
    { title: 'Spacious Family Home', price: 4500, type: 'HOUSE', address: '202 Suburb Ln, Austin', rooms: 4 },
    { title: 'Penthouse with City View', price: 12000, type: 'APARTMENT', address: '303 High St, San Francisco', rooms: 3 },
    { title: 'Garden Duplex', price: 3800, type: 'APARTMENT', address: '404 Green Ave, Seattle', rooms: 3 },
    { title: 'Rustic Cabin in the Woods', price: 2200, type: 'HOUSE', address: '505 Forest Rd, Denver', rooms: 2 },
    { title: 'Sleek Bachelor Pad', price: 2900, type: 'APARTMENT', address: '606 Neon Blvd, Las Vegas', rooms: 1 },
    { title: 'Historical Manor', price: 7500, type: 'HOUSE', address: '707 Heritage Dr, Boston', rooms: 6 },
  ];

  for (let i = 0; i < 20; i++) {
    const data = listings[i % listings.length];
    await prisma.listing.create({
      data: {
        title: `${data.title} ${Math.floor(i / 10) + 1}`,
        description: 'Experience luxury living at its finest. This property features premium amenities, stunning views, and high-end finishes throughout. Perfect for those who appreciate comfort and style.',
        price: data.price + (Math.random() * 500 - 250),
        address: data.address,
        propertyType: data.type,
        rooms: data.rooms,
        latitude: 40.7128 + (Math.random() * 0.1 - 0.05),
        longitude: -74.006 + (Math.random() * 0.1 - 0.05),
        status: i < 5 ? ListingStatus.PENDING : ListingStatus.APPROVED,
        userId: landlord.id,
        images: {
          create: [
            { url: `https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=800` }
          ]
        }
      },
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
