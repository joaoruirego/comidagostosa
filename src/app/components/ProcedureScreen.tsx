"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import styles from "../styles/ProcedureScreen.module.css";

const ProcedureScreen: React.FC<{ recipeId: string }> = ({ recipeId }) => {
  const [procedures, setProcedures] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProcedures = async () => {
      const { data, error } = await supabase
        .from("passos")
        .select("*")
        .eq("receita_id", recipeId)
        .order("ordem");

      if (error) {
        console.error("Error fetching procedures:", error);
      } else {
        setProcedures(data);
      }
    };

    fetchProcedures();
  }, [recipeId]);

  if (procedures.length === 0) return <div>Loading...</div>;

  const handleNext = () => {
    if (currentStep < procedures.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push(`/challenge/${recipeId}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Procedimento {currentStep + 1}</h1>
      <p className={styles.text}>{procedures[currentStep].instrucoes}</p>
      <button className={styles.button} onClick={handleNext}>
        Próximo
      </button>
    </div>
  );
};

export default ProcedureScreen;
