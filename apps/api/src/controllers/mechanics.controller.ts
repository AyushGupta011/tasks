import { Request, Response } from 'express';
import * as mechanicsService from '../services/mechanics.service.js';
import { MechanicStatus } from '@prisma/client';

export async function listMechanics(req: Request, res: Response) {
  const status = req.query.status as MechanicStatus | undefined;
  const mechanics = await mechanicsService.listMechanics(status);
  res.json({ data: mechanics });
}

export async function getMechanic(req: Request, res: Response) {
  const mechanic = await mechanicsService.getMechanicById(req.params.id as string);
  res.json({ data: mechanic });
}
