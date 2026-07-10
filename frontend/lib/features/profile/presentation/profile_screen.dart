import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 60,
              backgroundImage: NetworkImage('https://i.pravatar.cc/150?u=me'),
            ),
            const SizedBox(height: 16),
            Text(
              'Sir Bill',
              style: GoogleFonts.outfit(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              'sirbill@example.com',
              style: GoogleFonts.outfit(
                fontSize: 16,
                color: const Color(0xFF9A9FA5),
              ),
            ),
            const SizedBox(height: 32),
            const ProfileMenuItem(
              icon: Icons.person_outline,
              label: 'Edit Profile',
            ),
            const ProfileMenuItem(
              icon: Icons.home_outlined,
              label: 'My Listings',
            ),
            const ProfileMenuItem(
              icon: Icons.favorite_border,
              label: 'Saved Listings',
            ),
            const ProfileMenuItem(
              icon: Icons.verified_user_outlined,
              label: 'Verification Status',
            ),
            const ProfileMenuItem(
              icon: Icons.settings_outlined,
              label: 'Settings',
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade50,
                foregroundColor: Colors.red,
              ),
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String label;

  const ProfileMenuItem({super.key, required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF1A1D1F)),
          const SizedBox(width: 16),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const Spacer(),
          const Icon(Icons.chevron_right, color: Color(0xFF9A9FA5)),
        ],
      ),
    );
  }
}
