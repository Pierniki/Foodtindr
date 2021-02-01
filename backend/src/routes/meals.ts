import { Router } from 'express';
import fetch from 'node-fetch';
import cache from '../middlewares/cache';
import Redis from '../redis';

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
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
];

interface MealResponse {
  meals: Meal[];
}
interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

const fetchAll = async (): Promise<MealResponse> => {
  const promises = categories.map(async (category) => {
    const data = await Redis.asyncGet(category);
    if (data) return Promise.resolve(JSON.parse(data) as MealResponse);
    return fetchByCategory(category);
  });

  const mealsArrays = (await Promise.all(promises)).map((mealsArray) => {
    return mealsArray.meals;
  });

  const allMeals = ([] as Meal[]).concat(...mealsArrays);

  Redis.client.setex('all', 60 * 60 * 24, JSON.stringify(allMeals));

  return { meals: allMeals };
};

const fetchByCategory = async (category: string): Promise<MealResponse> => {
  console.log('Fetching by category: ' + category);

  if (!categories.includes(category)) return Promise.reject();

  const URI = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

  const response = await fetch(URI);
  const meals = await response.json();

  Redis.client.setex(category, 86400, JSON.stringify(meals));

  return meals;
};

router.get('/', cache, async (_, res) => {
  try {
    const meals = await fetchAll();
    if (!meals) return res.status(404);
    res.json(meals);
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
});

router.get('/:category', cache, async (req, res) => {
  try {
    const { category } = req.params;
    const meals = await fetchByCategory(category);
    if (!meals) return res.status(404);
    res.json(meals);
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
});

export default router;
