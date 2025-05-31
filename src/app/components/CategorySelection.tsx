"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/CategorySelection.module.css";
import { supabase } from "../supabaseClient";

type Category = {
  id: number;
  nome: string;
  cor: string;
  emoji: string;
};

const CategorySelection: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nome, cor, emoji");

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    router.push(`/recipes?category=${category}`);
  };

  return (
    <div>
      <h1>Escolha a Categoria</h1>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li
            key={category.id}
            className={styles.listItem}
            style={{ backgroundColor: category.cor }}
          >
            <button
              className={styles.button}
              onClick={() => handleCategoryClick(category.nome)}
            >
              {category.emoji} {category.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelection;
