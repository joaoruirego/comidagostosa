"use client";

import React from "react";
import CategorySelection from "./components/CategorySelection";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Bem-vindo ao App de Receitas!</h1>
      <CategorySelection />
    </div>
  );
};

export default HomePage;
