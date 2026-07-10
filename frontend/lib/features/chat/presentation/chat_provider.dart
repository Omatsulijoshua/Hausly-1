import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/network/dio_provider.dart';
import '../../auth/presentation/auth_provider.dart';
import '../data/chat_repository_impl.dart';
import '../domain/chat_repository.dart';
import '../domain/message_model.dart';

part 'chat_provider.g.dart';

@riverpod
ChatRepository chatRepository(Ref ref) {
  final dio = ref.watch(dioProvider);
  final repository = ChatRepositoryImpl(dio);
  
  // Update userId when auth state changes
  final authState = ref.watch(authStateProvider);
  authState.whenData((user) {
    if (user != null) {
      repository.setUserId(user.id);
    }
  });

  ref.onDispose(() {
    repository.dispose();
  });
  
  return repository;
}

@riverpod
Future<List<Map<String, dynamic>>> conversations(Ref ref) {
  return ref.watch(chatRepositoryProvider).getConversations();
}

@riverpod
Stream<List<Message>> chatMessages(Ref ref, String otherUserId) {
  return ref.watch(chatRepositoryProvider).getMessages(otherUserId);
}
