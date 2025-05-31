"use client";

import React from "react";

const FinalScreen: React.FC = () => {
  return (
    <div>
      <h1>Parabéns, Chefs!</h1>
      <p>Hora de tirar uma foto para comemorar!</p>
      <button onClick={() => alert("Foto tirada!")}>Tirar Foto</button>
    </div>
  );
};

export default FinalScreen;
