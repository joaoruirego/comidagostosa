"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<any>(null);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data: recipeData, error: recipeError } = await supabase
          .from("receitas")
          .select("*")
          .eq("id", id)
          .single();

        if (recipeError) throw recipeError;
        setRecipe(recipeData);

        const { data: procedureData, error: procedureError } = await supabase
          .from("passos")
          .select("*")
          .eq("receita_id", id)
          .order("ordem");

        if (procedureError) throw procedureError;
        setProcedures(procedureData);

        // Esta parte é opcional se ainda tiveres categoria_id na receita
        if (recipeData?.categoria_id) {
          const { data: challengeData, error: challengeError } = await supabase
            .from("desafios")
            .select("*")
            .eq("categoria_id", recipeData.categoria_id);

          if (challengeError) throw challengeError;
          setChallenges(challengeData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      <p>Tempo Estimado: {recipe.estimated_time} minutos</p>
      <button onClick={() => router.push(`/procedure/${id}`)}>Começar</button>
    </div>
  );
}
