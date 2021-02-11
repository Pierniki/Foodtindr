import fetch from 'node-fetch';
import Redis from '../redis';
import { Meal, MealDetails } from '../types';

interface MealResponse {
  meals: Meal[];
}

interface MealDetailsResponse {
  meals: MealDetails[];
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

export const fetchMealDetails = async (id: string) => {
  try {
    const cacheKey = id + '_details';
    const data = await getCachedData(cacheKey);
    if (data) return data;
    const URI = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    const response = await fetch(URI);
    const mealDetails = (await response.json()).meals[0];

    const parsedIngredients = Array.from(Array(20).keys())
      .map((i) => {
        const ingredient = mealDetails[`strIngredient${i + 1}`];
        const measure = mealDetails[`strMeasure${i + 1}`];
        console.log(!ingredient, !measure);
        if (!ingredient || !measure) return;
        return `${measure} ${ingredient}`;
      })
      .filter((value) => value);

    Redis.client.setex(cacheKey, 86400, JSON.stringify(mealDetails));

    return mealDetails;
  } catch (err) {
    Promise.reject(err);
  }
};

export const fetchByCategory = async (
  category: string
): Promise<MealResponse> => {
  try {
    if (!allCategories.includes(category)) return Promise.reject();

    const data = await getCachedData(category);
    if (data) return data;

    const URI = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    const response = await fetch(URI);
    const meals = await response.json();

    Redis.client.setex(category, 86400, JSON.stringify(meals));

    return meals;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
