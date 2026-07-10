I have successfully populated the database with dummy data and resolved the Next.js hydration error.

✅ Database Seeding Complete
I have populated the PostgreSQL database with a rich set of dummy data to help you test the platform:

3 Test Users:
Admin: admin@hausly.com / password123
Landlord: landlord@hausly.com / password123
Tenant: tenant@hausly.com / password123
20 Property Listings: A diverse range of apartments, houses, and villas with realistic prices, descriptions, and mock images from Unsplash.
Geographic Data: All listings include latitude and longitude coordinates for map-based testing.
Listing Statuses: A mix of APPROVED and PENDING listings to test the admin moderation features.
🔧 Fixes Applied
Hydration Error: Added suppressHydrationWarning to the html tag in web/src/app/layout.tsx. This prevents React from throwing errors when browser extensions (like Grammarly) modify the DOM before hydration.
Prisma Seeding Logic:
Migrated the seed script to JavaScript to bypass environment variable issues with ts-node.
Integrated the PrismaPg driver adapter into the seed script to match the backend's architecture, ensuring a stable connection to your local PostgreSQL instance.
The platform is now fully populated and the web interface is stable. You can explore the listings on the main marketplace or manage them via the Admin Dashboard.