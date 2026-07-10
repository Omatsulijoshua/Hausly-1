const { Client } = require('pg');
require('dotenv').config();

const sql = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('TENANT', 'LANDLORD', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "ListingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" text NOT NULL UNIQUE,
  "password" text,
  "name" text NOT NULL,
  "phone" text UNIQUE,
  "role" "Role" NOT NULL DEFAULT 'TENANT',
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "isVerified" boolean NOT NULL DEFAULT false,
  "avatarUrl" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Listing" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" text NOT NULL REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "price" double precision NOT NULL,
  "address" text NOT NULL,
  "latitude" double precision NOT NULL,
  "longitude" double precision NOT NULL,
  "propertyType" text NOT NULL,
  "rooms" integer NOT NULL,
  "facilities" text[] NOT NULL DEFAULT ARRAY[]::text[],
  "status" "ListingStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ListingImage" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "listingId" text NOT NULL REFERENCES "Listing"("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  "url" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "Message" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "senderId" text NOT NULL REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  "receiverId" text NOT NULL REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  "content" text NOT NULL,
  "imageUrl" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Report" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" text NOT NULL REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  "listingId" text REFERENCES "Listing"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  "reason" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Listing"
  ALTER COLUMN "facilities" SET DEFAULT ARRAY[]::text[];
`;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('Database schema initialized.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
