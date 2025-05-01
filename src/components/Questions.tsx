import React, { useState, useEffect } from "react";

interface Country {
  name: string;
  code: string;
}

const countries: Country[] = [
  { name: "Brasil", code: "br" },
  { name: "Estados Unidos", code: "us" },
  { name: "França", code: "fr" },
  { name: "Alemanha", code: "de" },
  { name: "Japão", code: "jp" },
];

export default function Questions() {
  const [correctCountry, setCorrectCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const shuffledCountries = [...countries].sort(() => Math.random() - 0.5);
    const correct = shuffledCountries[0];
    setCorrectCountry(correct);
    setOptions(shuffledCountries.slice(0, 3)); // Seleciona 3 opções
  };

  const handleAnswer = (selectedCountry: Country) => {
    if (selectedCountry.name === correctCountry?.name) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongCount(wrongCount + 1);
    }
    generateQuestion(); // Gera uma nova pergunta
  };

  return (
    <div className="quiz-container" style={styles.container}>
      {correctCountry && (
        <>
          <img src={`https://flagcdn.com/w320/${correctCountry.code}.png`} alt={`Bandeira de ${correctCountry.name}`} style={styles.flag} />
          <p style={styles.question}>Qual país pertence a esta bandeira?</p>
          <div style={styles.options}>
            {options.map((country) => (
              <button key={country.code} onClick={() => handleAnswer(country)} style={styles.optionButton}>
                {country.name}
              </button>
            ))}
          </div>
          <div style={styles.score}>
            <p>Corretas: {correctCount}</p>
            <p>Erradas: {wrongCount}</p>
          </div>
        </>
      )}
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
    width: "400px",
    textAlign: "center" as const,
  },
  flag: {
    width: "150px",
    height: "auto",
    marginBottom: "20px",
  },
  question: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    marginBottom: "20px",
    color: "#333",
  },
  options: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  optionButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#333",
    transition: "background-color 0.3s, color 0.3s",
  },
  score: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#333",
  },
};
