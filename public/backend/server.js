import createApp from './loaders/index.js';
import config from './config/config.js';

async function startServer() {
  try {
    const app = await createApp();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
