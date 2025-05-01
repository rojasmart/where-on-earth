import React from "react";

interface UiProps {
  flagUrl: string;
  countryName: string;
}

export default function Questions({ flagUrl, countryName }: UiProps) {
  return (
    <div className="question-container" style={styles.container}>
      <img src={flagUrl} alt={`Bandeira de ${countryName}`} style={styles.flag} />
      <p style={styles.question}>Onde está {countryName}?</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    width: "300px",
    textAlign: "center" as const,
  },
  flag: {
    width: "100px",
    height: "auto",
    marginBottom: "10px",
  },
  question: {
    fontSize: "18px",
    fontWeight: "bold" as const,
  },
};
