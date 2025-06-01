"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/RecipeDetail.module.css";
import Image from "next/image";

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
  ingredients: Ingredient[];
};

const RecipeDetail: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");

  const handleStart = () => {
    router.push(`/procedure/${recipe.id}?categoria_id=${categoryId}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.container}>
        <h1 className={styles.title}>{recipe.name}</h1>
        <Image
          className={styles.image}
          src={recipe.imagem_url}
          alt={recipe.name}
          width={1000}
          height={1000}
        />
        <p className={styles.description}>{recipe.description}</p>
        <p className={styles.time}>
          ⏱️ Tempo Estimado: {recipe.estimated_time} minutos
        </p>
        <h3 className={styles.ingredientsTitle}>Ingredientes</h3>
        <ul className={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id} className={styles.ingredientItem}>
              {ingredient.quantidade} {ingredient.nome}
            </li>
          ))}
        </ul>
        <button className={styles.startButton} onClick={handleStart}>
          Começar
        </button>
      </div>
    </Suspense>
  );
};

export default RecipeDetail;
