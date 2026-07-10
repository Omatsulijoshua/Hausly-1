import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'chat_provider.dart';


class ChatListScreen extends ConsumerWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversations = ref.watch(conversationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        centerTitle: true,
      ),
      body: conversations.when(
        data: (list) => ListView.builder(
          padding: const EdgeInsets.all(24),
          itemCount: list.length,
          itemBuilder: (context, index) {
            final convo = list[index];
            final user = convo['user'];
            return Column(
              children: [
                GestureDetector(
                  onTap: () {
                    // Navigate to ChatScreen
                  },
                  child: ChatListItem(
                    name: user['name'] ?? 'Unknown',
                    message: convo['lastMessage'] ?? '',
                    time: _formatDate(convo['createdAt']),
                    avatarUrl: user['avatarUrl'] ?? 'https://i.pravatar.cc/150',
                  ),
                ),
                const SizedBox(height: 16),
              ],
            );
          },
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return '';
    final dt = date is DateTime ? date : DateTime.parse(date.toString());
    return '${dt.day}/${dt.month}';
  }
}

class ChatListItem extends StatelessWidget {
  final String name;
  final String message;
  final String time;
  final bool isUnread;
  final String avatarUrl;

  const ChatListItem({
    super.key,
    required this.name,
    required this.message,
    required this.time,
    this.isUnread = false,
    required this.avatarUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundImage: NetworkImage(avatarUrl),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      name,
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      time,
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        color: const Color(0xFF9A9FA5),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  message,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    color: isUnread ? const Color(0xFF1A1D1F) : const Color(0xFF9A9FA5),
                    fontWeight: isUnread ? FontWeight.w600 : FontWeight.normal,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          if (isUnread)
            Container(
              margin: const EdgeInsets.only(left: 12),
              width: 10,
              height: 10,
              decoration: const BoxDecoration(
                color: Color(0xFF2D60FF),
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    );
  }
}
