"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../supabaseClient";

const RecipeDetail: React.FC<{ recipe: any }> = ({ recipe }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categorias")
        .select("*");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      const { data: categoryData, error: categoryError } = await supabase
        .from("categorias")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (categoryError) {
        console.error("Error fetching category:", categoryError);
      } else {
        setCategories([categoryData]);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleStart = () => {
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
      <button onClick={handleStart}>Começar</button>
    </div>
  );
};

export default RecipeDetail;
