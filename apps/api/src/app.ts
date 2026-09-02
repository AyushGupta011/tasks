import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import dashboardRoutes from './routes/dashboard.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import mechanicsRoutes from './routes/mechanics.routes.js';
import customersRoutes from './routes/customers.routes.js';

const app = express();

// ── Global Middleware ────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter);

// ── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/mechanics', mechanicsRoutes);
app.use('/api/customers', customersRoutes);

// ── Swagger Documentation ────────────────────────────────────────────────────

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Instant Mechanic API Docs',
}));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global Error Handler (must be last) ──────────────────────────────────────

app.use(errorHandler);

export { app };
