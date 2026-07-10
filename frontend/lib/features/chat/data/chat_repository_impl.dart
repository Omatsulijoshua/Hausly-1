import 'dart:async';
import 'package:dio/dio.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../domain/chat_repository.dart';
import '../domain/message_model.dart';
import '../../../core/config/config.dart';

class ChatRepositoryImpl implements ChatRepository {
  final Dio _dio;
  late io.Socket _socket;
  final _messageController = StreamController<List<Message>>.broadcast();
  List<Message> _messages = [];
  String? _currentUserId;

  ChatRepositoryImpl(this._dio) {
    _initSocket();
  }

  void _initSocket() {
    _socket = io.io(Config.backendUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    _socket.onConnect((_) {
      if (_currentUserId != null) {
        _socket.emit('join', _currentUserId);
      }
    });

    _socket.on('newMessage', (data) {
      final message = Message.fromJson(data);
      _messages.add(message);
      _messageController.add(List.from(_messages));
    });

    _socket.on('messageSent', (data) {
      final message = Message.fromJson(data);
      // If we want to avoid duplicates if we already added it locally
      if (!_messages.any((m) => m.id == message.id)) {
        _messages.add(message);
        _messageController.add(List.from(_messages));
      }
    });

    _socket.connect();
  }

  void setUserId(String userId) {
    _currentUserId = userId;
    if (_socket.connected) {
      _socket.emit('join', userId);
    }
  }

  @override
  Future<List<Map<String, dynamic>>> getConversations() async {
    try {
      final response = await _dio.get('${Config.backendUrl}/messages/conversations');
      return List<Map<String, dynamic>>.from(response.data);
    } catch (e) {
      return [];
    }
  }

  @override
  Stream<List<Message>> getMessages(String otherUserId) {
    _messages = [];
    _fetchHistory(otherUserId);
    return _messageController.stream;
  }

  Future<void> _fetchHistory(String otherUserId) async {
    try {
      final response = await _dio.get('${Config.backendUrl}/messages/chat/$otherUserId');
      final List<dynamic> data = response.data;
      _messages = data.map((json) => Message.fromJson(json)).toList();
      _messageController.add(List.from(_messages));
    } catch (e) {
      // Failed to fetch chat history, but we don't want to crash the app.
    }
  }

  @override
  Future<void> sendMessage(String receiverId, String content) async {
    if (_currentUserId == null) return;

    final data = {
      'senderId': _currentUserId,
      'receiverId': receiverId,
      'content': content,
    };

    _socket.emit('sendMessage', data);
  }

  void dispose() {
    _socket.dispose();
    _messageController.close();
  }
}
