import React, { FC } from 'react';
import { MealDetails } from '../../types';
import Container from '../common/Container';
import ImageWrapper from '../common/ImageWrapper';

interface RecipeProps {
  mealDetails: MealDetails;
}

const Recipe: FC<RecipeProps> = ({ mealDetails }) => {
  return (
    <Container>
      <h1>{mealDetails.strMeal}</h1>
      <h4>{mealDetails.strCategory}</h4>
      <ImageWrapper thumbnail={mealDetails.strMealThumb} />
      <h3>Ingredients: </h3>
      <ul>
        {mealDetails.ingredients.map((ingredient, idx) => {
          return <li key={`ingredient_${idx}`}>{ingredient}</li>;
        })}
      </ul>
      <h3>Steps: </h3>
      <div>
        {mealDetails.strInstructions.split('\n').map((instruction, idx) => {
          return <p key={`instruction_${idx}`}>{instruction}</p>;
        })}
      </div>
    </Container>
  );
};

export default Recipe;
