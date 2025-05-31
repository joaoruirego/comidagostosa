"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

const ProcedureScreen: React.FC<{ recipeId: string; categoryId: string }> = ({
  recipeId,
  categoryId,
}) => {
  const [procedures, setProcedures] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      const { data: procedureData, error: procedureError } = await supabase
        .from("passos")
        .select("*")
        .eq("receita_id", recipeId)
        .order("ordem");

      if (procedureError) {
        console.error("Error fetching procedures:", procedureError);
      } else {
        setProcedures(procedureData);
      }

      const { data: challengeData, error: challengeError } = await supabase
        .from("desafios")
        .select("*")
        .eq("categoria_id", categoryId);

      if (challengeError) {
        console.error("Error fetching challenges:", challengeError);
      } else {
        setChallenges(challengeData);
      }
    };

    fetchDetails();
  }, [recipeId, categoryId]);

  if (procedures.length === 0 || challenges.length === 0)
    return <div>Loading...</div>;

  const handleNext = () => {
    if (currentStep < procedures.length + challenges.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push(`/final`);
    }
  };

  const isProcedureStep = currentStep % 2 === 0;
  const currentContent = isProcedureStep
    ? procedures[currentStep / 2]
    : challenges[Math.floor(currentStep / 2)];

  return (
    <div>
      <h1>
        {isProcedureStep
          ? `Procedimento ${currentStep / 2 + 1}`
          : `Desafio ${Math.floor(currentStep / 2) + 1}`}
      </h1>
      <p>{currentContent.instrucoes || currentContent.texto}</p>
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
};

export default ProcedureScreen;
