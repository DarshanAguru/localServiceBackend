import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { router } from '../src/api/v1/routes/index.js';
import { connectDB } from './config/db.js';
import { swaggerSpec } from './config/swagger.js';

export const createServer = async () => {
  const app = express();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health',
  });
  app.use(
    cors({
      origin: 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(compression());
  app.use(limiter);

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: Date.now() });
  });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );

  app.use('/api/v1', router);
  app.use(errorMiddleware);
  connectDB();
  return app;
};
