import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { env } from './config/env';
import { errorHandler, notFound } from './middleware/error';
import leadsRouter from './routes/leads';
import authRouter from './routes/auth';
import contentRouter from './routes/content';

export function createApp() {
  const app = express();

  // Behind a proxy (Nginx, Vercel, Render) so req.ip reflects the real client.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(cookieParser());
  app.use(morgan(env.isProd ? 'combined' : 'dev'));

  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin/server-side calls, which send no Origin header.
        if (!origin) return cb(null, true);
        if (env.corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`Origin ${origin} is not allowed by CORS.`));
      },
      credentials: true,
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'xpertppc-backend',
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    });
  });

  app.use('/api/leads', leadsRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/content', contentRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
