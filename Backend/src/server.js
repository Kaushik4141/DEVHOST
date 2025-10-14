const { env } = require('./config/env');
const { connectDB } = require('./config/db');
const createApp = require('./app');
const SchedulerService = require('./services/scheduler');

async function bootstrap() {
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`);
    
    // Initialize scheduled tasks after server starts
    SchedulerService.initScheduledTasks();
  });
}

bootstrap().catch((e) => {
  console.error('[bootstrap] failed', e);
  process.exit(1);
});
