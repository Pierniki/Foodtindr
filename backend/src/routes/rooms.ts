import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

router.get('/new', async (req, res) => {
  console.log('new room');
  res.json({ id: nanoid() });
});

export default router;
