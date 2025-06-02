"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/FinalScreen.module.css";
import { useRouter } from "next/navigation";

const FinalScreen: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("chefes")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage.from("chefes").getPublicUrl(fileName);
      if (!data?.publicUrl) throw new Error("Erro ao obter URL pública");

      setUploadedUrl(data.publicUrl);
      setMessage("Upload feito com sucesso. Agora envie para o email.");
    } catch (err: unknown) {
      console.error(err);
      setMessage("Erro ao fazer upload.");
    } finally {
      setUploading(false);
    }
  };
  const router = useRouter();

  const handleSendEmail = async () => {
    if (!email || !uploadedUrl) {
      setMessage("Preencha o email e envie uma imagem.");
      return;
    }

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, imageUrl: uploadedUrl }),
    });

    if (res.ok) {
      setMessage("Email enviado com sucesso! 🎉");
    } else {
      setMessage("Erro ao enviar email.");
    }

    router.push("/");
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
      {!selectedImage && (
        <>
          <h1 className={styles.title}>É hora de comer e tirar fotos</h1>
          <p className={styles.description}>
            Parabéns, superaram todos os desafios! Vamos tirar fotos dos nossos
            chefes!
          </p>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={styles.button}
            disabled={uploading}
          >
            {uploading ? "Enviando imagem..." : "Escolher Imagem"}
          </button>
        </>
      )}

      {selectedImage && (
        <Image
          className={styles.image}
          src={selectedImage}
          alt="Preview"
          width={1000}
          height={1000}
        />
      )}

      {uploadedUrl && (
        <div style={{ marginTop: 10, width: "100%" }}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailInput}
          />
          <button className={styles.buttonConcluir} onClick={handleSendEmail}>
            Enviar imagem para o email →
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalScreen;
