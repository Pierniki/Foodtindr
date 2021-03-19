import Redis from '../../redis';
import { Meal } from '../../types';
import { replacer, reviver } from '../../util/jsonHelper';
import shuffle from '../../util/shuffle';

interface MealResponse {
  meals: Meal[];
}

enum Categories {
  BEEF = 'Beef',
  BREAKFAST = 'Breakfast',
  CHICKEN = 'Chicken',
  DESSERT = 'Dessert',
  GOAT = 'Goat',
  LAMB = 'Lamb',
  MISCELLANEOUS = 'Miscellaneous',
  PASTA = 'Pasta',
  PORK = 'Pork',
  SEAFOOD = 'Seafood',
  SIDE = 'Side',
  STARTER = 'Starter',
  VEGAN = 'Vegan',
  VEGETARIAN = 'Vegetarian',
}

type CategoriesString = keyof typeof Categories;

const cacheExpirationTime = 60 * 60 * 24;

class MealService {
  public static getFromCache = async (key: string) => {
    const data = await Redis.asyncGet(key);
    if (!data) return null;
    return JSON.parse(data, reviver);
  };

  public static setInCache = async (key: string, value: any) => {
    Redis.client.setex(
      key,
      cacheExpirationTime,
      JSON.stringify(value, replacer)
    );
  };

  public static getMealById = async (id: string): Promise<Meal> => {
    const mealString = await Redis.asyncGet(id);
    if (!mealString) return Promise.reject('No meal with id: ' + id);
    return JSON.parse(mealString, reviver);
  };

  public static getRandomMeals = async () => {
    const data = await MealService.getFromCache('mealIds');
    if (data) return data;
    const mealIds = await MealService.fetchAllMeals();
    const shuffledMealIds: string[] = shuffle(mealIds);
    return shuffledMealIds;
  };

  public static getMealDetails = async (id: string) => {
    const cacheKey = id + '_details';
    const data = await MealService.getFromCache(cacheKey);
    if (data) return data;

    const URI = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    // REVIEW
    const response = await fetch(URI);
    const mealDetails = (await response.json()).meals[0];
    const {
      idMeal,
      strMeal,
      strInstructions,
      strCategory,
      strMealThumb,
    } = mealDetails;

    const parsedIngredients = Array.from(Array(20).keys())
      .map((i) => {
        const ingredient = mealDetails[`strIngredient${i + 1}`];
        const measure = mealDetails[`strMeasure${i + 1}`];
        if (!ingredient || !measure) return;
        return `${ingredient} ${measure}`;
      })
      .filter((value) => value);

    const parsedMealDetails = {
      idMeal,
      strMeal,
      strInstructions,
      strCategory,
      strMealThumb,
      ingredients: parsedIngredients,
    };

    Redis.client.setex(
      cacheKey,
      cacheExpirationTime,
      JSON.stringify(parsedMealDetails)
    );

    return parsedMealDetails;
  };

  public static fetchAllMeals = async () => {
    let mealIds: string[] = [];
    const promises = Object.keys(Categories).map(async (category) => {
      return MealService.fetchMealsByCategory(category as CategoriesString);
    });

    const mealResponses = await Promise.all(promises);

    // REVIEW
    mealResponses.forEach(({ meals }, idx) => {
      meals.forEach(({ strMeal, strMealThumb, idMeal }) => {
        const mealToDb = {
          name: strMeal,
          thumbnail: strMealThumb,
          category: Object.keys(Categories)[idx],
        };
        mealIds.push(idMeal);
        Redis.client.set(idMeal, JSON.stringify(mealToDb));
      });
    });

    Redis.client.set('mealIds', JSON.stringify(mealIds));
    return mealIds;
  };

  public static fetchMealsByCategory = async (category: CategoriesString) => {
    const data: MealResponse = await MealService.getFromCache(category);
    if (data) return data;

    const URI = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    const response = await fetch(URI);
    const meals: MealResponse = await response.json();

    MealService.setInCache(category, meals);

    return meals;
  };
}

export default MealService;
