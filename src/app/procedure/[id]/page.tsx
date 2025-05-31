"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProcedureScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ CORRETO PARA NEXT 14
  const [procedures, setProcedures] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");

  useEffect(() => {
    const fetchData = async () => {
      // buscar categoria escolhida
      if (!categoryId) {
        console.error("❌ categoria_id não encontrado no URL");
        return;
      }

      // buscar passos da receita
      const { data: passos, error: passosError } = await supabase
        .from("passos")
        .select("*")
        .eq("receita_id", id)
        .order("ordem");

      if (passosError || !passos) {
        console.error("Erro ao buscar passos:", passosError);
        return;
      }

      setProcedures(passos);

      // buscar desafios da categoria
      const { data: desafios, error: desafiosError } = await supabase
        .from("desafios")
        .select("*")
        .eq("categoria_id", categoryId);

      if (desafiosError || !desafios) {
        console.error("Erro ao buscar desafios:", desafiosError);
        return;
      }

      // embaralha e limita à quantidade de passos
      const desafiosAleatorios = desafios
        .sort(() => Math.random() - 0.5)
        .slice(0, passos.length);
      setChallenges(desafiosAleatorios);
    };

    fetchData();
  }, [id, categoryId]);

  if (procedures.length === 0 || challenges.length === 0)
    return <div>Loading...</div>;

  const isStep = currentStep % 2 === 0;
  const index = Math.floor(currentStep / 2);

  const handleNext = () => {
    if (currentStep < procedures.length * 2 - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push(`/recipe-detail/${id}`);
    }
  };

  return (
    <div>
      <h1>{isStep ? `Procedimento ${index + 1}` : `Desafio ${index + 1}`}</h1>
      <p>{isStep ? procedures[index].instrucoes : challenges[index].texto}</p>
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
}
