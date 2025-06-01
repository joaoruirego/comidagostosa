"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../supabaseClient";
import styles from "../styles/RecipeList.module.css";
import Image from "next/image";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
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
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Receitas</h1>
      <input
        type="text"
        placeholder="🔎 Pesquisar receitas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      {loading ? (
        <ul className={styles.recipeList}>
          {Array.from({ length: 9 }).map((_, index) => (
            <li className={styles.skeletonItem} key={index}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.recipeList}>
          {filteredRecipes.map((recipe) => (
            <li className={styles.recipeItem} key={recipe.id}>
              <button
                className={styles.recipeButton}
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <div className={styles.recipeImage}>
                  <Image
                    src={recipe.imagem_url}
                    alt={recipe.name}
                    width={1000}
                    height={1000}
                  />
                </div>
                <div className={styles.recipeContent}>
                  <div className={styles.recipeName}>{recipe.name}</div>

                  <div className={styles.recipeDescription}>
                    {recipe.description}
                  </div>

                  <div className={styles.recipeTime}>
                    <span>⏱️</span> {recipe.estimated_time} minutos
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;
