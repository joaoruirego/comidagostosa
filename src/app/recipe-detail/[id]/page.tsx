"use client";

import React, { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import RecipeDetail from "../../components/RecipeDetail";
import styles from "../../styles/RecipeDetail.module.css";

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

const SkeletonRecipeDetailPage: React.FC = () => (
  <div className={styles.container}>
    <p className={styles.skeletonTitle}></p>
    <div className={styles.skeletonImage}></div>
    <p className={styles.skeletonText}></p>
    <p className={styles.skeletonText}></p>
    <ul className={styles.ingredientsList}>
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index} className={styles.skeletonText}></li>
      ))}
    </ul>
    <button className={styles.skeletonButton}>Só um momento...</button>
  </div>
);

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

  if (!recipe) return <SkeletonRecipeDetailPage />;

  const recipeWithIngredients = {
    ...recipe,
    ingredients: ingredients,
  };

  return <RecipeDetail recipe={recipeWithIngredients} />;
};

export default RecipeDetailPage;
