process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URI_TEST ||
  'mongodb://127.0.0.1:27017/xpertppc_crm_test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test-secret-key-at-least-32-characters-long!!';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000';
