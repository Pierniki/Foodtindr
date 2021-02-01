import { Router } from 'express';

const router = Router();
const categories = [
  'Beef',
  'Breakfast',
  'Chicken',
  'Dessert',
  'Goat',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Port',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
];

router.get('/', async (req, res) => {
  res.json({ msg: 'meals' });
});

export default router;
