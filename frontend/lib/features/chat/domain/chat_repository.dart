import 'message_model.dart';

abstract class ChatRepository {
  Future<List<Map<String, dynamic>>> getConversations();
  Stream<List<Message>> getMessages(String otherUserId);
  Future<void> sendMessage(String receiverId, String content);
}
