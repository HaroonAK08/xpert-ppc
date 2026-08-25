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
  /** Inbox that receives form submissions and course applications. */
  leadNotifyTo: process.env.LEAD_NOTIFY_TO || 'umer@xpertppc.com',
  /** Public site origin, used in accept/reject email links. */
  siteUrl: (process.env.PUBLIC_SITE_URL || 'https://xpertppc.com').replace(/\/$/, ''),
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
