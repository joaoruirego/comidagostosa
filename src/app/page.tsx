"use client";

import React from "react";
import CategorySelection from "./components/CategorySelection";
import styles from "./styles/HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <CategorySelection />
    </div>
  );
};

export default HomePage;
