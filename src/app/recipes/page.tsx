"use client";

import React from 'react';
import RecipeList from '../components/RecipeList';

const RecipesPage: React.FC = () => {
  return (
    <div>
      <h1>Receitas</h1>
      <RecipeList />
    </div>
  );
};

export default RecipesPage; 