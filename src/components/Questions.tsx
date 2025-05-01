import React, { useState, useEffect } from "react";

interface Country {
  name: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
}

const countries: Country[] = [
  { name: "Brasil", code: "br", coordinates: [-51.9253, -14.235] },
  { name: "Estados Unidos", code: "us", coordinates: [-95.7129, 37.0902] },
  { name: "França", code: "fr", coordinates: [2.2137, 46.2276] },
  { name: "Alemanha", code: "de", coordinates: [10.4515, 51.1657] },
  { name: "Japão", code: "jp", coordinates: [138.2529, 36.2048] },
];

export default function Questions({ onPin }: { onPin: (coordinates: [number, number]) => void }) {
  const [correctCountry, setCorrectCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);

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
    setClickedCountry(selectedCountry.name); // Atualiza o país clicado
    if (selectedCountry.name === correctCountry?.name) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongCount(wrongCount + 1);
    }
    if (correctCountry) {
      onPin(correctCountry.coordinates);
    }
    generateQuestion(); // Gera uma nova pergunta
  };

  return (
    <div className="quiz-container" style={styles.container}>
      {correctCountry && (
        <>
          <img src={`https://flagcdn.com/w320/${correctCountry.code}.png`} alt={`Bandeira de ${correctCountry.name}`} style={styles.flag} />
          <p style={styles.question}>Que país pertence a esta bandeira?</p>
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
          <div style={styles.clickedCountry}>
            <h3>País Selecionado:</h3>
            <p>{clickedCountry || "Nenhum país selecionado"}</p>
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
  clickedCountry: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#333",
  },
};
