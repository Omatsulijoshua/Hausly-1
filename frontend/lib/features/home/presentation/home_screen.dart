import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'listing_provider.dart';
import '../../../core/router/app_router.dart';
import '../../../shared/widgets/listing_card.dart';


class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Location',
                          style: GoogleFonts.outfit(
                            color: const Color(0xFF9A9FA5),
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on, color: Color(0xFF2D60FF), size: 18),
                            const SizedBox(width: 4),
                            Text(
                              'Los Angeles, CA',
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF1A1D1F),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: const Icon(Icons.notifications_outlined),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                Text(
                  'Find Your Dream\nRental Property',
                  style: Theme.of(context).textTheme.displayLarge,
                ),
                const SizedBox(height: 24),
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Search for properties...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: Container(
                      margin: const EdgeInsets.all(8),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2D60FF),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.tune, color: Colors.white, size: 20),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Featured Listings',
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF1A1D1F),
                      ),
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text('See All'),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  height: 280,
                  child: ref.watch(listingsStateProvider).when(
                        data: (listings) => ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: listings.length,
                          itemBuilder: (context, index) {
                            final listing = listings[index];
                            return Padding(
                              padding: const EdgeInsets.only(right: 16),
                              child: GestureDetector(
                                onTap: () => ref.read(routerProvider).push('/listing/${listing.id}'),
                                child: ListingCard(
                                  title: listing.title,
                                  location: listing.address,
                                  price: listing.price,
                                  imageUrl: listing.images.isNotEmpty 
                                    ? listing.images.first.url 
                                    : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
                                  isVerified: true,
                                ),
                              ),
                            );
                          },
                        ),
                        loading: () => const Center(child: CircularProgressIndicator()),
                        error: (err, stack) => Center(child: Text('Error: $err')),
                      ),
                ),
                const SizedBox(height: 32),
                Text(
                  'Nearby Properties',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1A1D1F),
                  ),
                ),
                const SizedBox(height: 16),
                ref.watch(listingsStateProvider).when(
                      data: (listings) => ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: listings.length > 2 ? 2 : listings.length,
                        itemBuilder: (context, index) {
                          final listing = listings[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: GestureDetector(
                              onTap: () => ref.read(routerProvider).push('/listing/${listing.id}'),
                              child: NearbyListingItem(
                                title: listing.title,
                                location: listing.address,
                                price: listing.price,
                                imageUrl: listing.images.isNotEmpty 
                                  ? listing.images.first.url 
                                  : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
                              ),
                            ),
                          );
                        },
                      ),
                      loading: () => const SizedBox(),
                      error: (err, stack) => const SizedBox(),
                    ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class NearbyListingItem extends StatelessWidget {
  final String title;
  final String location;
  final double price;
  final String imageUrl;

  const NearbyListingItem({
    super.key,
    required this.title,
    required this.location,
    required this.price,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.network(
              imageUrl,
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, color: Color(0xFF9A9FA5), size: 14),
                    const SizedBox(width: 4),
                    Text(
                      location,
                      style: GoogleFonts.outfit(
                        fontSize: 13,
                        color: const Color(0xFF9A9FA5),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  '\$${price.toStringAsFixed(0)}/mo',
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF2D60FF),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
