"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

const CategorySelection: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
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
    <div>
      <h1>Escolha a Categoria</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <button onClick={() => handleCategoryClick(category.id)}>
              {category.emoji} {category.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelection;
