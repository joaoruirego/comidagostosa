"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

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
    } catch (err: any) {
      console.error(err);
      setMessage("Erro ao fazer upload.");
    } finally {
      setUploading(false);
    }
  };

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
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Envie sua foto</h1>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Enviando imagem..." : "Escolher Imagem"}
      </button>

      {selectedImage && (
        <div style={{ marginTop: 20 }}>
          <Image src={selectedImage} alt="Preview" width={300} height={300} />
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginTop: 20 }}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, width: 300 }}
          />
          <button onClick={handleSendEmail} style={{ marginTop: 10 }}>
            Enviar imagem para o email
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
};

export default FinalScreen;
