import { Router } from 'express';
import mealsRouter from './meals';
import roomsRouter from './rooms';

const router = Router();

router.use('/meals', mealsRouter);
router.use('/rooms', roomsRouter);

export default router;
