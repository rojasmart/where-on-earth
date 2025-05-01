import React, { useState, useEffect } from "react";

interface Country {
  name: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
  aliases?: string[]; // Optional aliases for the country
}

const countries: Country[] = [
  { name: "Brasil", code: "br", coordinates: [-51.9253, -14.235] },
  { name: "Estados Unidos", code: "us", coordinates: [-95.7129, 37.0902] },
  { name: "França", code: "fr", coordinates: [2.2137, 46.2276] },
  { name: "Alemanha", code: "de", coordinates: [10.4515, 51.1657] },
  { name: "Japão", code: "jp", coordinates: [138.2529, 36.2048] },
];

// Função para normalizar nomes de países
const normalizeCountryName = (name: string): string => {
  // Map de nomes em inglês para nomes em português
  const countryNameMap: Record<string, string> = {
    // Inglês -> Português
    Brazil: "Brasil",
    "United States": "Estados Unidos",
    "United States of America": "Estados Unidos",
    USA: "Estados Unidos",
    France: "França",
    Germany: "Alemanha",
    Japan: "Japão",

    // Variações comuns
    US: "Estados Unidos",
    "U.S.A.": "Estados Unidos",
    Brasilien: "Brasil",
    Brésil: "Brasil",
    Allemagne: "Alemanha",
    Alemania: "Alemanha",
    Francia: "França",
    Frankreich: "França",
    Japon: "Japão",
    Japón: "Japão",
  };

  // Tenta encontrar o nome normalizado no mapa
  return countryNameMap[name] || name;
};

export default function Questions({
  onPin,
  registerClickHandler,
}: {
  onPin: (coordinates: [number, number]) => void;
  registerClickHandler: (handler: (country: any) => void) => void;
}) {
  const [correctCountry, setCorrectCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);
  const [gameStage, setGameStage] = useState<"flag" | "map">("flag");
  const [instruction, setInstruction] = useState<string>("");

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    registerClickHandler(onCountryClick);
  }, [registerClickHandler]);

  const generateQuestion = () => {
    const shuffledCountries = [...countries].sort(() => Math.random() - 0.5);
    const correct = shuffledCountries[0];
    setCorrectCountry(correct);
    setOptions(shuffledCountries.slice(0, 3)); // Seleciona 3 opções
    setGameStage("flag");
    setInstruction("Que país pertence a esta bandeira?");
  };

  const handleAnswer = (selectedCountry: Country) => {
    setClickedCountry(selectedCountry.name); // Atualiza o país clicado

    if (selectedCountry.name === correctCountry?.name) {
      // Correct flag identification
      setGameStage("map");
      setInstruction(`Agora clique no mapa onde fica ${correctCountry.name}`);
      if (correctCountry) {
        onPin(correctCountry.coordinates);
      }
    } else {
      // Wrong flag identification
      setWrongCount(wrongCount + 1);
      generateQuestion(); // Move to next question
    }
  };

  const handleMapClick = (countryName: string) => {
    if (gameStage === "map" && correctCountry) {
      // Normaliza o nome do país clicado para comparar com nosso padrão
      const normalizedClickedName = normalizeCountryName(countryName);

      if (normalizedClickedName === correctCountry.name) {
        // Identificação correta no mapa
        setCorrectCount(correctCount + 1);
        alert(`Parabéns! Você acertou a localização de ${correctCountry.name}!`);
      } else {
        // Identificação incorreta no mapa
        setWrongCount(wrongCount + 1);
        alert(`Incorreto! Você clicou em ${countryName} (${normalizedClickedName}), mas a resposta correta é ${correctCountry.name}.`);
      }
      generateQuestion(); // Avança para a próxima questão
    }
  };

  // Add this function to your component to be passed to App.tsx
  // and then to GeoJsonLayer.tsx
  const onCountryClick = (countryFeature: any) => {
    if (gameStage === "map") {
      console.log("Country click received:", countryFeature);

      // Check if countryFeature is completely empty
      if (!countryFeature) {
        console.error("Empty countryFeature received in onCountryClick");
        alert("Nenhum país foi detectado no local clicado. Por favor, tente novamente.");
        return;
      }

      // Check if countryFeature and properties exist before accessing properties.name
      if (countryFeature.properties && countryFeature.properties.name) {
        const clickedName = countryFeature.properties.name;
        handleMapClick(clickedName);
      } else {
        // Handle case when the country data is incomplete
        console.error("Country data is incomplete:", countryFeature);

        // Try to get any available identifier for better error messages
        let countryId = "Unknown";
        let errorMessage = "Erro ao identificar o país clicado.";

        if (countryFeature.properties) {
          console.log("Available properties:", Object.keys(countryFeature.properties));

          // Check various common country identifiers
          if (countryFeature.properties.ISO_A3) countryId = countryFeature.properties.ISO_A3;
          if (countryFeature.properties.name_long) countryId = countryFeature.properties.name_long;
          if (countryFeature.properties.NAME) countryId = countryFeature.properties.NAME;
          if (countryFeature.properties.ADMIN) countryId = countryFeature.properties.ADMIN;
        }

        if (countryFeature.id) countryId = countryFeature.id;

        if (countryId !== "Unknown") {
          errorMessage = `Erro ao identificar o país clicado (ID: ${countryId}).`;
        }

        alert(`${errorMessage} Por favor, tente novamente.`);
        console.log("Debug info:", { countryFeature, countryId });
      }
    }
  };

  return (
    <div className="quiz-container" style={styles.container}>
      {correctCountry && (
        <>
          <img src={`https://flagcdn.com/w320/${correctCountry.code}.png`} alt={`Bandeira de ${correctCountry.name}`} style={styles.flag} />
          <p style={styles.question}>{instruction}</p>

          {gameStage === "flag" && (
            <div style={styles.options}>
              {options.map((country) => (
                <button key={country.code} onClick={() => handleAnswer(country)} style={styles.optionButton}>
                  {country.name}
                </button>
              ))}
            </div>
          )}

          {gameStage === "map" && <div style={styles.mapInstruction}>Clique no país correto no mapa!</div>}

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
  mapInstruction: {
    padding: "10px",
    backgroundColor: "#e0f7fa",
    borderRadius: "5px",
    border: "1px solid #4fc3f7",
    color: "#0277bd",
    marginBottom: "20px",
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
