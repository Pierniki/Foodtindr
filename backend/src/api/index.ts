import fetch from 'node-fetch';
import Redis from '../redis';

interface MealResponse {
  meals: Meal[];
}

export interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

const allCategories = [
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

const getCachedData = async (key: string) => {
  const data = await Redis.asyncGet(key);
  if (!data) return null;
  console.log('Fetching ' + key + ' from cache');
  return JSON.parse(data);
};

export const fetchDBMealData = async () => {
  try {
    console.log('fetching db meal data!');
    let mealIds: string[] = [];
    const promises = allCategories.map(async (category) => {
      return fetchByCategory(category);
    });

    const mealResponses = await Promise.all(promises);

    mealResponses.forEach(({ meals }, idx) => {
      meals.forEach(({ strMeal, strMealThumb, idMeal }) => {
        const mealToDb = {
          name: strMeal,
          thumbnail: strMealThumb,
          category: allCategories[idx],
        };
        mealIds.push(idMeal);
        Redis.client.set(idMeal, JSON.stringify(mealToDb));
      });
    });

    Redis.client.set('mealIds', JSON.stringify(mealIds));
  } catch (err) {
    console.error(err);
  }
};

export const fetchByCategory = async (
  category: string
): Promise<MealResponse> => {
  if (!allCategories.includes(category)) return Promise.reject();

  const data = await getCachedData(category);
  if (data) return data;

  const URI = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

  const response = await fetch(URI);
  const meals = await response.json();

  Redis.client.setex(category, 86400, JSON.stringify(meals));

  return meals;
};
