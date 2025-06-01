"use client";

import React, { Suspense } from "react";
import RecipeList from "../components/RecipeList";

const RecipesPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipeList />
    </Suspense>
  );
};

export default RecipesPage;
