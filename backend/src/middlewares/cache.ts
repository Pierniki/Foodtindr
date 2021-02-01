import { NextFunction, Request, Response } from 'express';
import Redis from '../redis';

const cache = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.params.category ? req.params.category : 'all';
    const data = await Redis.asyncGet(category);
    if (!data) return next();
    console.log('Fetching ' + category + ' from cache');
    return res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
  }
};

export default cache;
