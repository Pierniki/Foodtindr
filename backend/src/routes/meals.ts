import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ msg: 'meals' });
});

export default router;
