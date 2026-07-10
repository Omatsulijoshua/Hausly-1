import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class SearchScreen extends ConsumerWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Properties'),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search city, address, or ZIP...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          // Filter Tags
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Row(
              children: [
                const FilterTag(label: 'All', isSelected: true),
                const FilterTag(label: 'Apartment'),
                const FilterTag(label: 'House'),
                const FilterTag(label: 'Villa'),
                const FilterTag(label: 'Office'),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              children: const [
                NearbyListingItem(
                  title: 'Luxury Penthouse',
                  location: 'Downtown, LA',
                  price: 4500,
                  imageUrl: 'https://images.unsplash.com/photo-1512918766775-d26394484f51?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
                ),
                SizedBox(height: 16),
                NearbyListingItem(
                  title: 'Garden Duplex',
                  location: 'Pasadena, CA',
                  price: 2800,
                  imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class FilterTag extends StatelessWidget {
  final String label;
  final bool isSelected;

  const FilterTag({super.key, required this.label, this.isSelected = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF2D60FF) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? const Color(0xFF2D60FF) : Colors.grey.shade200,
        ),
      ),
      child: Text(
        label,
        style: GoogleFonts.outfit(
          color: isSelected ? Colors.white : const Color(0xFF9A9FA5),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
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
