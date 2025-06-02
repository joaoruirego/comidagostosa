"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

const FinalScreen: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("Por favor, selecione uma imagem.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setError(null);
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("📤 Iniciando upload:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("chefes")
        .upload(filePath, file);

      if (uploadError) {
        console.error("❌ Erro no upload:", uploadError.message || uploadError);
        throw uploadError;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("chefes")
        .getPublicUrl(filePath);

      if (publicUrlError || !publicUrlData?.publicUrl) {
        console.error("❌ Erro ao obter URL pública:", publicUrlError);
        throw new Error("Erro ao obter URL pública.");
      }

      console.log("✅ Upload concluído:", publicUrlData.publicUrl);
      setUploadedUrl(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error("❗ Erro inesperado:", err?.message || err);
      setError(err?.message || "Erro desconhecido");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload de Foto para Supabase</h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <button onClick={handleTakePhoto} disabled={uploading}>
        {uploading ? "Enviando..." : "Selecionar Foto"}
      </button>

      {selectedImage && (
        <div style={{ marginTop: 20 }}>
          <Image src={selectedImage} alt="Preview" width={300} height={300} />
        </div>
      )}

      {uploadedUrl && (
        <p style={{ marginTop: 10, color: "green" }}>
          ✅ Upload concluído:{" "}
          <a href={uploadedUrl} target="_blank">
            Ver imagem
          </a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FinalScreen;
