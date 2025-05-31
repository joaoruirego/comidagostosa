"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import RecipeDetail from "../../components/RecipeDetail";

const RecipeDetailPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const router = useRouter();
  const { id } = params;

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
