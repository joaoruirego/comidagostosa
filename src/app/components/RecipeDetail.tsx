"use client";

import React from "react";
import styles from "../styles/RecipeDetail.module.css";

const RecipeDetail: React.FC<{ recipe: any }> = ({ recipe }) => {
  return (
    <div>
      <h1>{recipe.name}</h1>
      <img className={styles.img} src={recipe.imagem_url} alt={recipe.name} />
      <p className={styles.description}>{recipe.description}</p>
      <p className={styles.description}>
        Tempo Estimado: {recipe.estimated_time} minutos
      </p>
      <h3>Ingredientes:</h3>
      <ul className={styles.list}>
        {recipe.ingredients.map((ingredient: any) => (
          <li key={ingredient.id} className={styles.listItem}>
            {ingredient.quantidade} {ingredient.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
