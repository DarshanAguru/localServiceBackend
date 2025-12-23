import { createServer } from './app.js';
import { env } from './config/env.js';

const PORT = Number(env.port ?? 3001);

(async () => {
  try {
    const app = await createServer();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
})();
