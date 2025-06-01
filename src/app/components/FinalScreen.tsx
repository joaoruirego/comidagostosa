"use client";

import React from "react";
import styles from "../styles/FinalScreen.module.css";
import Image from "next/image";

const FinalScreen: React.FC = () => {
  const handleTakePhoto = () => {
    // Logic to take a photo
    console.log("Taking a photo...");
  };

  return (
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
      <h1 className={styles.title}>Agora é hora de comer e tirar fotos</h1>
      <h1 className={styles.description}>
        Parabéns, superaram todos os desafios! Vamos tirar fotos dos chefes para
        que eles possam ver o que você fez
      </h1>
      <button onClick={handleTakePhoto} className={styles.button}></button>
    </div>
  );
};

export default FinalScreen;
