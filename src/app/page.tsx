"use client";

import React from "react";
import CategorySelection from "./components/CategorySelection";
import styles from "./styles/HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao App de Receitas!</h1>
      <CategorySelection />
    </div>
  );
};

export default HomePage;
