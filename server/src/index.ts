import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { APP_CONFIG } from './config/app';
import { createScoreRoutes } from './routes/scoreRoutes';
import { errorHandler } from './middleware/errorHandler';

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const app = express();

app.use(cors({ origin: APP_CONFIG.corsOrigin }));
app.use(express.json());

app.use('/api/scores', createScoreRoutes());

app.use(errorHandler);

app.listen(APP_CONFIG.port, () => {
  process.stdout.write(`Server running on port ${APP_CONFIG.port}\n`);
});
