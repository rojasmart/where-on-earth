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
  if (!name) return "";

  // Remove acentos, converte para minúsculas e remove espaços extras
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  // Mapeamento expandido de nomes de países
  const countryNameMap: Record<string, string> = {
    // Brasil
    brazil: "brasil",
    brasil: "brasil",
    bra: "brasil",
    brasilien: "brasil",
    bresil: "brasil",
    "federative republic of brazil": "brasil",

    // Estados Unidos
    "united states": "estados unidos",
    "united states of america": "estados unidos",
    usa: "estados unidos",
    us: "estados unidos",
    "united states": "estados unidos",

    // França
    france: "franca",
    fra: "franca",
    francia: "franca",
    frankreich: "franca",

    // Alemanha
    germany: "alemanha",
    deu: "alemanha",
    deutschland: "alemanha",
    allemagne: "alemanha",

    // Japão
    japan: "japao",
    jpn: "japao",
    japon: "japao",
  };

  return countryNameMap[normalized] || normalized;
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
      console.log("Handling map click for:", countryName);

      // Mapeamento de ISO codes para nomes em português
      const isoToName = {
        BRA: "Brasil",
        USA: "Estados Unidos",
        FRA: "França",
        DEU: "Alemanha",
        JPN: "Japão",
      };

      // Se o nome for um código ISO, converte para o nome em português
      const processedName = isoToName[countryName] || countryName;

      console.log("Country comparison:", {
        clicked: processedName,
        correct: correctCountry.name,
        isMatch: processedName === correctCountry.name,
      });

      if (processedName === correctCountry.name) {
        setCorrectCount((prev) => prev + 1);
        alert(`Parabéns! Você acertou a localização de ${correctCountry.name}!`);
        generateQuestion();
      } else {
        setWrongCount((prev) => prev + 1);
        alert(`Incorreto! Você clicou em ${processedName}, mas a resposta correta é ${correctCountry.name}.`);
        generateQuestion();
      }
    }
  };

  // Add this function to your component to be passed to App.tsx
  // and then to GeoJsonLayer.tsx
  // Em Questions.tsx, modifique a função onCountryClick:

  const onCountryClick = (countryFeature: any) => {
    if (gameStage === "map") {
      if (!countryFeature || !countryFeature.properties) {
        console.error("Dados do país inválidos");
        return;
      }

      // Log para debug
      console.log("Country feature:", countryFeature);

      // Pega o código ISO ou nome do país
      const countryCode = countryFeature.properties.ISO_A3 || countryFeature.properties["ISO3166-1-Alpha-3"];

      if (countryCode) {
        console.log("Country code detected:", countryCode);
        handleMapClick(countryCode);
        return;
      }

      // Fallback para o nome do país
      const countryName = countryFeature.properties.name;
      if (countryName) {
        console.log("Country name detected:", countryName);
        handleMapClick(countryName);
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
