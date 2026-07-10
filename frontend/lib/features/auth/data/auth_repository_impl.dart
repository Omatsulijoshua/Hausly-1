import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../domain/auth_repository.dart';
import '../domain/user_model.dart';
import '../../../core/config/config.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Dio _dio;
  final FlutterSecureStorage _storage;
  static const String _baseUrl = '${Config.backendUrl}/auth';
  static const String _tokenKey = 'auth_token';

  AuthRepositoryImpl(this._dio, this._storage);

  @override
  Future<User> login(String email, String password) async {
    try {
      final response = await _dio.post('$_baseUrl/login', data: {
        'email': email,
        'password': password,
      });

      final token = response.data['access_token'];
      await _storage.write(key: _tokenKey, value: token);

      return User.fromJson(response.data['user']);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<User> register(String email, String password, String name) async {
    try {
      final response = await _dio.post('$_baseUrl/register', data: {
        'email': email,
        'password': password,
        'name': name,
      });

      final token = response.data['access_token'];
      await _storage.write(key: _tokenKey, value: token);

      return User.fromJson(response.data['user']);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
  }

  @override
  Future<User?> getCurrentUser() async {
    final token = await _storage.read(key: _tokenKey);
    if (token == null) return null;

    try {
      // In a real app, you might have a /me endpoint
      final response = await _dio.get('$_baseUrl/me', options: Options(
        headers: {'Authorization': 'Bearer $token'}
      ));
      return User.fromJson(response.data);
    } catch (e) {
      await logout();
      return null;
    }
  }
}
