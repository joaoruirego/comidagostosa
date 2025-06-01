"use client";

import React, { useRef, useState } from "react";
import styles from "../styles/FinalScreen.module.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const FinalScreen: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoria_id");
  const id = searchParams.get("id");

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        setError("Por favor, insira um email válido");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        setError("Erro ao enviar email. Por favor, tente novamente.");
      }
    } catch (error) {
      setError("Ocorreu um erro inesperado. Por favor, tente novamente.");
    }
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

      {selectedImage ? (
        <form onSubmit={handleSubmit}>
          <Image
            src={selectedImage}
            alt="Selected photo"
            width={300}
            height={300}
            className={styles.image}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            className={styles.emailInput}
          />
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          <button type="submit" className={styles.buttonConcluir}>
            Concluir
          </button>
        </form>
      ) : (
        <>
          <h1 className={styles.title}>É hora de comer e tirar fotos</h1>
          <h1 className={styles.description}>
            Parabéns, superaram todos os desafios! Vamos tirar fotos dos nossos
            chefes!
          </h1>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button onClick={handleTakePhoto} className={styles.button}></button>
        </>
      )}
    </div>
  );
};

export default FinalScreen;
