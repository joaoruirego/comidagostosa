"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../supabaseClient";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");

  useEffect(() => {
    const fetchData = async () => {
      const [recipesResponse, categoriesResponse] = await Promise.all([
        supabase.from("receitas").select("*"),
        supabase.from("categorias").select("*"),
      ]);

      if (recipesResponse.error) {
        console.error("Error fetching recipes:", recipesResponse.error);
      } else {
        setRecipes(recipesResponse.data);
      }

      if (categoriesResponse.error) {
        console.error("Error fetching categories:", categoriesResponse.error);
      } else {
        setCategories(categoriesResponse.data);
      }
    };

    fetchData();
  }, []);

  const handleRecipeClick = (recipeId: string) => {
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
            <button onClick={() => handleRecipeClick(recipe.id)}>
              {recipe.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
