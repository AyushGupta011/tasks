import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service.js';

export async function getDashboard(req: Request, res: Response) {
  const days = (req.query as any).days as number;
  const stats = await getDashboardStats(days);
  res.json({ data: stats });
}
