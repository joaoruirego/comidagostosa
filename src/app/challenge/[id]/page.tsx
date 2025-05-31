"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChallengeScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id"); // ✅ categoriaId correto da URL

  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!categoryId) {
      console.error("⚠️ category_id não está na URL");
      return;
    }

    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from("desafios")
        .select("*")
        .eq("categoria_id", categoryId); // ✅ aqui tá certo agora

      if (error) {
        console.error("Error fetching challenges:", error);
      } else {
        setChallenges(data);
      }
    };

    fetchChallenges();
  }, [categoryId]);

  if (challenges.length === 0) return <div>Loading...</div>;

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      router.push(`/recipe-detail/${id}`);
    }
  };

  return (
    <div>
      <h1>Desafio {currentChallenge + 1}</h1>
      <p>{challenges[currentChallenge].texto}</p>
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
}
