"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [recipe, setRecipe] = useState<any>(null);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    console.log("Fetching recipe with ID:", id);
    const fetchDetails = async () => {
      const { data: recipeData, error: recipeError } = await supabase
        .from("receitas")
        .select("*")
        .eq("id", id)
        .single();

      if (recipeError) {
        console.error("Error fetching recipe:", recipeError);
      } else {
        console.log("Fetched recipe data:", recipeData);
        setRecipe(recipeData);
      }

      const { data: procedureData, error: procedureError } = await supabase
        .from("passos")
        .select("*")
        .eq("receita_id", id)
        .order("ordem");

      if (procedureError) {
        console.error("Error fetching procedures:", procedureError);
      } else {
        setProcedures(procedureData);
      }

      const { data: challengeData, error: challengeError } = await supabase
        .from("desafios")
        .select("*")
        .eq("categoria_id", recipeData.categoria_id);

      if (challengeError) {
        console.error("Error fetching challenges:", challengeError);
      } else {
        setChallenges(challengeData);
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
