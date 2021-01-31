import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

router.get('/new', async (req, res) => {
  const id = nanoid(6);
  res.json({ id: id });
});

export default router;
