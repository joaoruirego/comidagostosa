"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from("receitas").select("*");

      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        setRecipes(data);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = (recipeId: string, categoryId: string) => {
    router.push(`/recipe-detail/${recipeId}?categoria_id=${categoryId}`);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Lista de Receitas</h1>
      <input
        type="text"
        placeholder="Pesquisar receitas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe.id}>
            <button
              onClick={() => handleRecipeClick(recipe.id, recipe.categoria_id)}
            >
              {recipe.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
