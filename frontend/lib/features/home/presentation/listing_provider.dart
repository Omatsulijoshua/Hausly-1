import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/network/dio_provider.dart';
import '../data/listing_repository_impl.dart';
import '../domain/listing_model.dart';
import '../domain/listing_repository.dart';

part 'listing_provider.g.dart';

@riverpod
ListingRepository listingRepository(Ref ref) {
  final dio = ref.watch(dioProvider);
  return ListingRepositoryImpl(dio);
}

@riverpod
class ListingsState extends _$ListingsState {
  @override
  FutureOr<List<Listing>> build() async {
    return ref.watch(listingRepositoryProvider).getListings();
  }

  Future<void> fetchListings({Map<String, dynamic>? filters}) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      return await ref.read(listingRepositoryProvider).getListings(filters: filters);
    });
  }
}

@riverpod
Future<Listing> listingDetails(Ref ref, String id) {
  return ref.watch(listingRepositoryProvider).getListingById(id);
}
