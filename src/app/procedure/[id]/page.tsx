"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter } from "next/navigation";

export default function ProcedureScreen({
  params,
}: {
  params: { id: string };
}) {
  const [procedures, setProcedures] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    const fetchProcedures = async () => {
      const { data, error } = await supabase
        .from("passos")
        .select("*")
        .eq("receita_id", id)
        .order("ordem");

      if (error) {
        console.error("Error fetching procedures:", error);
      } else {
        setProcedures(data);
      }
    };

    fetchProcedures();
  }, [id]);

  if (procedures.length === 0) return <div>Loading...</div>;

  const handleNext = () => {
    if (currentStep < procedures.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push(`/challenge/${id}`);
    }
  };

  return (
    <div>
      <h1>Procedimento {currentStep + 1}</h1>
      <p>{procedures[currentStep].instrucoes}</p>
      <button onClick={handleNext}>Próximo</button>
    </div>
  );
}
