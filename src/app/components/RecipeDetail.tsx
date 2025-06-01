"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/RecipeDetail.module.css";
import Image from "next/image";
import { supabase } from "../supabaseClient";

type Ingredient = {
  id: string;
  quantidade: string;
  ingrediente_id: string;
  ingredientes: {
    nome: string;
  };
};

type Recipe = {
  id: string;
  name: string;
  description: string;
  estimated_time: number;
  imagem_url: string;
  ingredients: Ingredient[];
};

const SkeletonRecipeDetail: React.FC = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>😅</h1>
    <div className={styles.skeletonImage}></div>
    <p className={styles.skeletonText}></p>
    <p className={styles.skeletonText}></p>
    <h3 className={styles.ingredientsTitle}>Ingredientes</h3>
    <ul className={styles.ingredientsList}>
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index} className={styles.skeletonText}></li>
      ))}
    </ul>
    <button className={styles.skeletonButton}>Só um momento...</button>
  </div>
);

const RecipeDetail: React.FC<{ recipe: Omit<Recipe, "ingredients"> }> = ({
  recipe: baseRecipe,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from("receita_ingredientes")
        .select("id, quantidade, ingrediente_id, ingredientes(nome)")
        .eq("receita_id", baseRecipe.id)
        .order("ordem");

      if (error) {
        console.error("Erro ao buscar ingredientes:", error);
      } else {
        setIngredients(data || []);
      }

      setLoading(false);
    };

    fetchIngredients();
  }, [baseRecipe.id]);

  const handleStart = () => {
    router.push(`/procedure/${baseRecipe.id}?categoria_id=${categoryId}`);
  };

  return (
    <Suspense fallback={<SkeletonRecipeDetail />}>
      <div className={styles.container}>
        <h1 className={styles.title}>{baseRecipe.name}</h1>
        <Image
          className={styles.image}
          src={baseRecipe.imagem_url}
          alt={baseRecipe.name}
          width={1000}
          height={1000}
        />
        <p className={styles.description}>{baseRecipe.description}</p>
        <p className={styles.time}>
          ⏱️ Tempo Estimado: {baseRecipe.estimated_time} minutos
        </p>

        <h3 className={styles.ingredientsTitle}>Ingredientes</h3>
        {loading ? (
          <ul className={styles.ingredientsList}>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className={styles.skeletonText}></li>
            ))}
          </ul>
        ) : (
          <ul className={styles.ingredientsList}>
            {ingredients.map((ingredient) => (
              <li
                key={ingredient.id}
                style={{ fontWeight: 500 }}
                className={styles.ingredientItem}
              >
                {ingredient.ingredientes.nome}{" "}
                <b style={{ fontWeight: 300 }}>{ingredient.quantidade}</b>
              </li>
            ))}
          </ul>
        )}

        <button className={styles.startButton} onClick={handleStart}>
          Começar
        </button>
      </div>
    </Suspense>
  );
};

export default RecipeDetail;
