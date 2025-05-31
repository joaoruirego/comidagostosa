"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/RecipeList.module.css";
import { supabase } from "../supabaseClient";

type Recipe = {
  id: number;
  name: string;
  // Add other fields as necessary
};

const RecipeList: React.FC = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

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

  const handleRecipeClick = (id: number) => {
    router.push(`/recipe-detail/${id}`);
  };

  return (
    <div>
      <h1>Lista de Receitas</h1>
      <input
        className={styles.input}
        type="text"
        placeholder="Pesquisar por receita ou tópico..."
      />
      <ul className={styles.list}>
        {recipes.map((recipe) => (
          <li key={recipe.id} className={styles.listItem}>
            <button
              className={styles.button}
              onClick={() => handleRecipeClick(recipe.id)}
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
