import React, { FC } from 'react';
import styled from 'styled-components';
import { MealDetails } from '../../types';
import Container from '../common/Container';

interface RecipeProps {
  mealDetails: MealDetails;
}

const SectionHeader = styled.h3`
  margin: 0;
  box-sizing: border-box;
  padding: 15px 0;

  width: 100%;
  color: white;
  text-align: center;
  background-color: var(--primary-dark);
`;

const RecipeTitle = styled(SectionHeader)`
  font-size: 30px;
  background-color: var(--primary);
`;

const IngredientsList = styled.ul`
  margin: 50px auto;
  list-style: square;
`;

const Instructions = styled(Container)`
  text-align: justify;
  box-sizing: border-box;
  padding: 0 20px;
  margin: 40px 0 80px 0;
`;

const Recipe: FC<RecipeProps> = ({ mealDetails }) => {
  return (
    <Container>
      <RecipeTitle>{mealDetails.strMeal}</RecipeTitle>
      <img src={mealDetails.strMealThumb} alt={mealDetails.strMeal} />

      <SectionHeader>Ingredients:</SectionHeader>
      <IngredientsList>
        {mealDetails.ingredients.map((ingredient, idx) => {
          return <li key={`ingredient_${idx}`}>{ingredient}</li>;
        })}
      </IngredientsList>

      <SectionHeader>Steps:</SectionHeader>
      <Instructions>
        {mealDetails.strInstructions.split('\n').map((instruction, idx) => {
          return <p key={`instruction_${idx}`}>{instruction}</p>;
        })}
      </Instructions>
    </Container>
  );
};

export default Recipe;
