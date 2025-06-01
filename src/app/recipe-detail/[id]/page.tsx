"use client";

import React, { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import RecipeDetail from "../../components/RecipeDetail";

type Ingredient = {
  id: string;
  quantidade: string;
  nome: string;
};

type Recipe = {
  id: string;
  name: string;
  description: string;
  estimated_time: number;
  imagem_url: string;
};

const RecipeDetailPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const fetchRecipeAndIngredients = async () => {
      try {
        // Fetch recipe
        const { data: recipeData, error: recipeError } = await supabase
          .from("receitas")
          .select("*")
          .eq("id", id)
          .single();

        if (recipeError) {
          console.error("Error fetching recipe:", recipeError);
          return;
        }

        // Fetch ingredients
        const { data: ingredientsData, error: ingredientsError } =
          await supabase
            .from("receita_ingredientes")
            .select("*, ingredientes(nome)")
            .eq("receita_id", id);

        if (ingredientsError) {
          console.error("Error fetching ingredients:", ingredientsError);
          return;
        }

        setRecipe(recipeData);
        setIngredients(ingredientsData || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchRecipeAndIngredients();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return <RecipeDetail recipe={{ ...recipe, ingredients }} />;
};

export default RecipeDetailPage;
