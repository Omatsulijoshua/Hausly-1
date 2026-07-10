import 'package:freezed_annotation/freezed_annotation.dart';

part 'listing_model.freezed.dart';
part 'listing_model.g.dart';

@freezed
abstract class ListingImage with _$ListingImage {
  const factory ListingImage({
    required String id,
    required String url,
  }) = _ListingImage;

  factory ListingImage.fromJson(Map<String, dynamic> json) => _$ListingImageFromJson(json);
}

@freezed
abstract class Listing with _$Listing {
  const factory Listing({
    required String id,
    required String title,
    required String description,
    required double price,
    required String address,
    required double latitude,
    required double longitude,
    required String propertyType,
    required int rooms,
    required List<String> facilities,
    @Default([]) List<ListingImage> images,
    @Default('PENDING') String status,
    required String userId,
    DateTime? createdAt,
  }) = _Listing;

  factory Listing.fromJson(Map<String, dynamic> json) => _$ListingFromJson(json);
}


