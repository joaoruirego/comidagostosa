"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import styles from "../styles/ChallengeScreen.module.css";

const ChallengeScreen: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from("desafios")
        .select("*")
        .eq("categoria_id", categoryId);

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
      router.push(`/recipe-detail/${categoryId}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Desafio {currentChallenge + 1}</h1>
      <p className={styles.text}>{challenges[currentChallenge].texto}</p>
      <button className={styles.button} onClick={handleNext}>
        Próximo
      </button>
    </div>
  );
};

export default ChallengeScreen;
