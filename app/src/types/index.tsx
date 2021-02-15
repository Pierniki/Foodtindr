export interface ColorProps {
  primary?: boolean;
}

export interface RelativityProps {
  top?: string;
  left?: string;
}

export interface SizeProps {
  width?: string;
  height?: string;
}

export interface RoomIdParams {
  id: string;
}

export interface FontProps {
  fontSize?: string;
}

export interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface MealDetails extends Meal {
  strCategory: string;
  strInstructions: string;
  ingredients: string[];
}
