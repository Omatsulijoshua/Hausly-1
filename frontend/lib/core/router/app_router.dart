import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/signup_screen.dart';
import '../../features/auth/presentation/launch_screen.dart';
import '../../features/home/presentation/main_screen.dart';
import '../../features/chat/presentation/chat_screen.dart';
import '../../features/listing/presentation/listing_details_screen.dart';
import '../../features/listing/presentation/create_listing_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/launch',
    routes: [
      GoRoute(
        path: '/launch',
        builder: (context, state) => const LaunchScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const MainScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/chat/:userId/:userName',
        builder: (context, state) => ChatScreen(
          otherUserId: state.pathParameters['userId']!,
          otherUserName: state.pathParameters['userName']!,
        ),
      ),
      GoRoute(
        path: '/listing/:id',
        builder: (context, state) => ListingDetailsScreen(
          id: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/create-listing',
        builder: (context, state) => const CreateListingScreen(),
      ),
    ],
  );
});
