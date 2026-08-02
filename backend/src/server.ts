import { createApp } from './app';
import { connectDb, disconnectDb } from './config/db';
import { env } from './config/env';

async function start() {
  await connectDb();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[server] xpertppc-backend listening on http://localhost:${env.port}`);
    console.log(`[server] env=${env.nodeEnv} cors=${env.corsOrigins.join(', ')}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n[server] ${signal} received, shutting down…`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
    // Don't hang forever if a connection refuses to close.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});
