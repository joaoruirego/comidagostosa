"use client";

import { useEffect, useState, use, Suspense } from "react";
import { supabase } from "../../supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/ProcedureScreen.module.css";
import Image from "next/image";
type Procedure = {
  id: string;
  instrucoes: string;
  ordem: number;
};

type Challenge = {
  id: string;
  texto: string;
};

const SkeletonProcedureScreen: React.FC = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>😅</h1>
    <div className={styles.skeletonText}></div>
    <div className={styles.skeletonText}></div>
    <button className={styles.skeletonButton}>Só um momento...</button>
  </div>
);

export default function ProcedureScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!categoryId) {
          setError(
            "Categoria não encontrada. Por favor, selecione uma categoria."
          );
          return;
        }

        // buscar passos da receita
        const { data: passos, error: passosError } = await supabase
          .from("passos")
          .select("*")
          .eq("receita_id", id)
          .order("ordem");

        if (passosError || !passos) {
          setError("Erro ao carregar os passos da receita.");
          return;
        }

        setProcedures(passos);

        // buscar desafios da categoria
        const { data: desafios, error: desafiosError } = await supabase
          .from("desafios")
          .select("*")
          .eq("categoria_id", categoryId);

        if (desafiosError || !desafios) {
          setError("Erro ao carregar os desafios.");
          return;
        }

        // embaralha e limita à quantidade de passos
        const desafiosAleatorios = desafios
          .sort(() => Math.random() - 0.5)
          .slice(0, passos.length);
        setChallenges(desafiosAleatorios);
      } catch {
        setError("Ocorreu um erro inesperado. Por favor, tente novamente.");
      }
    };

    fetchData();
  }, [id, categoryId]);

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => router.back()}>Voltar</button>
      </div>
    );
  }

  if (procedures.length === 0 || challenges.length === 0) {
    return <SkeletonProcedureScreen />;
  }

  const isStep = currentStep % 2 === 0;
  const index = Math.floor(currentStep / 2);

  const handleNext = () => {
    if (currentStep < procedures.length * 2 - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push(`/recipe-detail/${id}?categoria_id=${categoryId}`);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
        <h1 className={styles.title}>
          {isStep ? `Passo ${index + 1}` : `Desafio ${index + 1}`}
        </h1>
        <p className={styles.text}>
          {isStep ? procedures[index].instrucoes : challenges[index].texto}
        </p>
        <button className={styles.nextButton} onClick={handleNext}>
          Próximo →
        </button>
      </div>
    </Suspense>
  );
}
