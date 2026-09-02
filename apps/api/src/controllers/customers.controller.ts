import { Request, Response } from 'express';
import * as customersService from '../services/customers.service.js';

export async function listCustomers(req: Request, res: Response) {
  const result = await customersService.listCustomers(req.query as any);
  res.json(result);
}
