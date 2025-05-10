import React, { useState, useEffect } from "react";

interface Country {
  name: string;
  code: string;
  aliases?: string[]; // Optional aliases for the country
}

const countries: Country[] = [
  { name: "Brasil", code: "br" },
  { name: "Estados Unidos", code: "us" },
  { name: "França", code: "fr" },
  { name: "Alemanha", code: "de" },
  { name: "Japão", code: "jp" },
  { name: "Argentina", code: "ar" },
  { name: "Canadá", code: "ca" },
  { name: "Reino Unido", code: "gb" },
  { name: "Austrália", code: "au" },
  { name: "Índia", code: "in" },
  { name: "China", code: "cn" },
  { name: "Rússia", code: "ru" },
  { name: "Itália", code: "it" },
  { name: "Espanha", code: "es" },
  { name: "México", code: "mx" },
  { name: "África do Sul", code: "za" },
  { name: "Turquia", code: "tr" },
  { name: "Egipto", code: "eg" },
  { name: "Suécia", code: "se" },
  { name: "Noruega", code: "no" },
  { name: "Dinamarca", code: "dk" },
  { name: "Finlândia", code: "fi" },
  { name: "Polónia", code: "pl" },
  { name: "Bélgica", code: "be" },
  { name: "Países Baixos", code: "nl" },
  { name: "Suíça", code: "ch" },
  { name: "Áustria", code: "at" },
  { name: "Grécia", code: "gr" },
  { name: "Portugal", code: "pt" },
  { name: "Irlanda", code: "ie" },
  { name: "República Checa", code: "cz" },
  { name: "Hungria", code: "hu" },
  { name: "Roménia", code: "ro" },
  { name: "Bulgária", code: "bg" },
  { name: "Sérvia", code: "rs" },
  { name: "Croácia", code: "hr" },
  { name: "Eslovénia", code: "si" },
  { name: "Eslováquia", code: "sk" },
  { name: "Islândia", code: "is" },
  { name: "Malásia", code: "my" },
  { name: "Singapura", code: "sg" },
  { name: "Filipinas", code: "ph" },
  { name: "Indonésia", code: "id" },
  { name: "Tailândia", code: "th" },
  { name: "Vietname", code: "vn" },
  { name: "Coreia do Sul", code: "kr" },
  { name: "Nova Zelândia", code: "nz" },
  { name: "Colômbia", code: "co" },
  { name: "Chile", code: "cl" },
  { name: "Peru", code: "pe" },
  { name: "Venezuela", code: "ve" },
  { name: "Equador", code: "ec" },
  { name: "Paraguai", code: "py" },
  { name: "Uruguai", code: "uy" },
  { name: "Bolívia", code: "bo" },
  { name: "Costa Rica", code: "cr" },
  { name: "Panamá", code: "pa" },
  { name: "Cuba", code: "cu" },
  { name: "República Dominicana", code: "do" },
  { name: "Honduras", code: "hn" },
  { name: "Guatemala", code: "gt" },
  { name: "El Salvador", code: "sv" },
  { name: "Nicarágua", code: "ni" },
  { name: "Jamaica", code: "jm" },
  { name: "Trindade e Tobago", code: "tt" },
  { name: "Barbados", code: "bb" },
  { name: "Bahamas", code: "bs" },
  { name: "Santa Lúcia", code: "lc" },
  { name: "São Vicente e Granadinas", code: "vc" },
  { name: "Antígua e Barbuda", code: "ag" },
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
      // Atualiza o país clicado para exibir na interface
      setClickedCountry(countryName);

      // Normaliza ambos os nomes para comparação robusta
      const normalizedClicked = normalizeCountryName(countryName);
      const normalizedCorrect = normalizeCountryName(correctCountry.name);

      console.log("Comparação de países:", {
        clickedOriginal: countryName,
        clickedNormalized: normalizedClicked,
        correctOriginal: correctCountry.name,
        correctNormalized: normalizedCorrect,
        isMatch: normalizedClicked === normalizedCorrect,
      });

      if (normalizedClicked === normalizedCorrect) {
        setCorrectCount((prev) => prev + 1);
        alert(`Parabéns! Você acertou a localização de ${correctCountry.name}!`);
        generateQuestion();
      } else {
        setWrongCount((prev) => prev + 1);
        alert(`Incorreto! Você clicou em ${countryName}, mas a resposta correta é ${correctCountry.name}.`);
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

      // Use o nome traduzido se existir, senão ISO, senão nome original
      const countryName =
        countryFeature.properties.translatedName ||
        countryFeature.properties.name ||
        countryFeature.properties.ISO_A3 ||
        countryFeature.properties["ISO3166-1-Alpha-3"];

      if (countryName) {
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
