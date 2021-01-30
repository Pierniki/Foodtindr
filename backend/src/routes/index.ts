import { Router } from 'express';
import mealsRouter from './meals';

const router = Router();

router.use('/meals', mealsRouter);

export default router;
