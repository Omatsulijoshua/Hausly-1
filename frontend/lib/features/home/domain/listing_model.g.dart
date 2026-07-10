// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'listing_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ListingImage _$ListingImageFromJson(Map<String, dynamic> json) =>
    _ListingImage(id: json['id'] as String, url: json['url'] as String);

Map<String, dynamic> _$ListingImageToJson(_ListingImage instance) =>
    <String, dynamic>{'id': instance.id, 'url': instance.url};

_Listing _$ListingFromJson(Map<String, dynamic> json) => _Listing(
  id: json['id'] as String,
  title: json['title'] as String,
  description: json['description'] as String,
  price: (json['price'] as num).toDouble(),
  address: json['address'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  propertyType: json['propertyType'] as String,
  rooms: (json['rooms'] as num).toInt(),
  facilities: (json['facilities'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  images:
      (json['images'] as List<dynamic>?)
          ?.map((e) => ListingImage.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  status: json['status'] as String? ?? 'PENDING',
  userId: json['userId'] as String,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$ListingToJson(_Listing instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'description': instance.description,
  'price': instance.price,
  'address': instance.address,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'propertyType': instance.propertyType,
  'rooms': instance.rooms,
  'facilities': instance.facilities,
  'images': instance.images,
  'status': instance.status,
  'userId': instance.userId,
  'createdAt': instance.createdAt?.toIso8601String(),
};
