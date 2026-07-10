const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning database...');
  try {
    await prisma.listingImage.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Clean failed, maybe tables dont exist yet:', e.message);
  }

  console.log('Seeding users...');
  const password = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hausly.com',
      password,
      name: 'Admin Hausly',
      role: 'ADMIN',
      status: 'ACTIVE',
      isVerified: true,
    },
  });

  const landlord = await prisma.user.create({
    data: {
      email: 'landlord@hausly.com',
      password,
      name: 'John Landlord',
      role: 'LANDLORD',
      status: 'ACTIVE',
      isVerified: true,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      email: 'tenant@hausly.com',
      password,
      name: 'Sarah Tenant',
      role: 'TENANT',
      status: 'ACTIVE',
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
  ];

  for (let i = 0; i < 20; i++) {
    const data = listings[i % listings.length];
    await prisma.listing.create({
      data: {
        title: `${data.title} ${i + 1}`,
        description: 'Experience luxury living at its finest. This property features premium amenities, stunning views, and high-end finishes throughout.',
        price: data.price + (Math.random() * 500 - 250),
        address: data.address,
        propertyType: data.type,
        rooms: data.rooms,
        facilities: [],
        latitude: 40.7128 + (Math.random() * 0.1 - 0.05),
        longitude: -74.006 + (Math.random() * 0.1 - 0.05),
        status: i < 5 ? 'PENDING' : 'APPROVED',
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
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
