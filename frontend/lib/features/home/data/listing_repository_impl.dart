import 'package:dio/dio.dart';
import '../domain/listing_model.dart';
import '../domain/listing_repository.dart';
import '../../../core/config/config.dart';

class ListingRepositoryImpl implements ListingRepository {
  final Dio _dio;
  static const String _baseUrl = '${Config.backendUrl}/listings';

  ListingRepositoryImpl(this._dio);

  @override
  Future<List<Listing>> getListings({Map<String, dynamic>? filters}) async {
    try {
      final response = await _dio.get(_baseUrl, queryParameters: filters);
      return (response.data as List).map((json) => Listing.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Listing> getListingById(String id) async {
    try {
      final response = await _dio.get('$_baseUrl/$id');
      return Listing.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Listing> createListing(Map<String, dynamic> data, {List<String>? imagePaths}) async {
    try {
      final formData = FormData.fromMap(data);
      
      if (imagePaths != null) {
        for (final path in imagePaths) {
          formData.files.add(MapEntry(
            'images',
            await MultipartFile.fromFile(path),
          ));
        }
      }

      final response = await _dio.post(_baseUrl, data: formData);
      return Listing.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
