import 'listing_model.dart';

abstract class ListingRepository {
  Future<List<Listing>> getListings({Map<String, dynamic>? filters});
  Future<Listing> getListingById(String id);
  Future<Listing> createListing(Map<String, dynamic> data, {List<String>? imagePaths});
}
