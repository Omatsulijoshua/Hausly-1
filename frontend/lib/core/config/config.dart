class Config {
  static const String backendUrl = String.fromEnvironment(
    'BACKEND_URL',
    defaultValue: 'https://hausly-backend-fs0v.onrender.com',
  );
}
