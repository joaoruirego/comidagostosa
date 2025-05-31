"use client";

import React from "react";
import { useRouter } from "next/navigation";

const RecipeDetail: React.FC<{ recipe: any }> = ({ recipe }) => {
  const router = useRouter();

  const handleStart = (categoryId: string) => {
    router.push(`/procedure/${recipe.id}?categoria_id=${categoryId}`);
  };

  return (
    <div>
      <h1>{recipe.name}</h1>
      <img src={recipe.imagem_url} alt={recipe.name} />
      <p>{recipe.description}</p>
      <p>Tempo Estimado: {recipe.estimated_time} minutos</p>
      <h3>Ingredientes:</h3>
      <ul>
        {recipe.ingredients.map((ingredient: any) => (
          <li key={ingredient.id}>
            {ingredient.quantidade} {ingredient.nome}
          </li>
        ))}
      </ul>
      <button onClick={() => handleStart(recipe.categoria_id)}>Começar</button>
    </div>
  );
};

export default RecipeDetail;
