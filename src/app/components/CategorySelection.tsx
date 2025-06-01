"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import styles from "../styles/CategorySelection.module.css";
import Image from "next/image";
type Category = {
  id: string;
  nome: string;
  emoji: string;
};

const CategorySelection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categorias").select("*");

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/recipes?categoria_id=${categoryId}`);
  };

  return (
    <div className={styles.container}>
      <Image
        src="/backgroundTeste2.png"
        alt="background"
        width={1000}
        height={1000}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          opacity: 0.15,
        }}
      />
      <h1 className={styles.title}>Escolha a Categoria</h1>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id} className={styles.listItem}>
            <button
              className={styles.button}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className={styles.emoji}>{category.emoji}</span>{" "}
              {category.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelection;
