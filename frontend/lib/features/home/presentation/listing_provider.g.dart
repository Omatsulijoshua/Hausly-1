// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'listing_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(listingRepository)
final listingRepositoryProvider = ListingRepositoryProvider._();

final class ListingRepositoryProvider
    extends
        $FunctionalProvider<
          ListingRepository,
          ListingRepository,
          ListingRepository
        >
    with $Provider<ListingRepository> {
  ListingRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'listingRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$listingRepositoryHash();

  @$internal
  @override
  $ProviderElement<ListingRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  ListingRepository create(Ref ref) {
    return listingRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ListingRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ListingRepository>(value),
    );
  }
}

String _$listingRepositoryHash() => r'b30b7a8ce5158f2333401c8266d76f017fdfc775';

@ProviderFor(ListingsState)
final listingsStateProvider = ListingsStateProvider._();

final class ListingsStateProvider
    extends $AsyncNotifierProvider<ListingsState, List<Listing>> {
  ListingsStateProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'listingsStateProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$listingsStateHash();

  @$internal
  @override
  ListingsState create() => ListingsState();
}

String _$listingsStateHash() => r'1999c48797820ec636c87c2ddcd0db8e2eb67f5d';

abstract class _$ListingsState extends $AsyncNotifier<List<Listing>> {
  FutureOr<List<Listing>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<List<Listing>>, List<Listing>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<List<Listing>>, List<Listing>>,
              AsyncValue<List<Listing>>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

@ProviderFor(listingDetails)
final listingDetailsProvider = ListingDetailsFamily._();

final class ListingDetailsProvider
    extends $FunctionalProvider<AsyncValue<Listing>, Listing, FutureOr<Listing>>
    with $FutureModifier<Listing>, $FutureProvider<Listing> {
  ListingDetailsProvider._({
    required ListingDetailsFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'listingDetailsProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$listingDetailsHash();

  @override
  String toString() {
    return r'listingDetailsProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<Listing> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<Listing> create(Ref ref) {
    final argument = this.argument as String;
    return listingDetails(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is ListingDetailsProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$listingDetailsHash() => r'4cbb2612372acc5e963c16fe243ff0f5e7561e85';

final class ListingDetailsFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<Listing>, String> {
  ListingDetailsFamily._()
    : super(
        retry: null,
        name: r'listingDetailsProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ListingDetailsProvider call(String id) =>
      ListingDetailsProvider._(argument: id, from: this);

  @override
  String toString() => r'listingDetailsProvider';
}
