function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. See backend/.env.example`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGODB_URI'),
  jwtSecret: (() => {
    const s = required('JWT_SECRET');
    if (s.length < 32) throw new Error('JWT_SECRET must be at least 32 characters.');
    return s;
  })(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  /** Comma-separated list of browser origins allowed to call this API. */
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  /** Inbox for website lead / audit form submissions. */
  leadNotifyTo: process.env.LEAD_NOTIFY_TO || 'umer@xpertppc.com',
  /** Inbox for Digital Academy course applications (Accept/Reject links). */
  coursesNotifyTo:
    process.env.COURSES_NOTIFY_TO ||
    process.env.LEAD_NOTIFY_TO ||
    'umer@xpertppc.com',
  /** Public agency site origin (admin / marketing links). */
  siteUrl: (process.env.PUBLIC_SITE_URL || 'https://xpertppc.com').replace(/\/$/, ''),
  /** The standalone CRM app (crm-frontend) — where Meta's OAuth callback sends the browser back to. */
  crmAppUrl: (process.env.CRM_APP_URL || 'http://localhost:3100').replace(/\/$/, ''),
  /** This API's own public origin — used for links that must be hit directly (e.g. email unsubscribe). */
  apiPublicUrl: (process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT ?? 5000}`).replace(/\/$/, ''),
  /** How often due email-sequence steps are checked and sent, in ms. 0 disables it. */
  sequenceCheckIntervalMs: Number(process.env.SEQUENCE_CHECK_INTERVAL_MS ?? 5 * 60 * 1000),
  /** Courses / Digital Academy origin (student + application links). */
  coursesSiteUrl: (process.env.COURSES_SITE_URL || 'https://xpertppc.net').replace(/\/$/, ''),
  /** Service-account JSON (raw or base64). Never ship this to the mobile app. */
  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '',
  /** How often every connected Google Sheet gets auto-synced, in ms. 0 disables it. */
  sheetSyncIntervalMs: Number(process.env.SHEET_SYNC_INTERVAL_MS ?? 5 * 60 * 1000),
  /** Meta (Facebook/Instagram) Lead Ads integration — all optional; feature is disabled until every value is set. */
  meta: {
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    graphVersion: process.env.META_GRAPH_VERSION || 'v21.0',
    webhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || '',
    oauthRedirectUri: process.env.META_OAUTH_REDIRECT_URI || '',
    /** Encrypts Page access tokens at rest. Generate with: openssl rand -base64 48 */
    tokenEncryptionKey: process.env.META_TOKEN_ENCRYPTION_KEY || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    /** From address for lead alerts (and fallback for other mail). */
    from: process.env.SMTP_FROM || 'Xpert PPC <team@xpertppc.com>',
    /** From address for course signup/login codes. */
    otpFrom:
      process.env.SMTP_OTP_FROM ||
      process.env.SMTP_FROM ||
      'Xpert PPC <team@xpertppc.com>',
  },
  get isProd() {
    return this.nodeEnv === 'production';
  },
};

export type Env = typeof env;
