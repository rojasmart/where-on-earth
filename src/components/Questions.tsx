import React, { useState, useEffect } from "react";

interface Country {
  name: string;
  code: string;
  aliases?: string[]; // Optional aliases for the country
}

const countries: Country[] = [
  { name: "Brasil", code: "BR" },
  { name: "Estados Unidos", code: "US" },
  { name: "França", code: "FR" },
  { name: "Alemanha", code: "DE" },
  { name: "Japão", code: "JP" },
  { name: "Argentina", code: "AR" },
  { name: "Canadá", code: "CA" },
  { name: "Reino Unido", code: "GB" },
  { name: "Austrália", code: "AU" },
  { name: "Índia", code: "IN" },
  { name: "China", code: "CN" },
  { name: "Rússia", code: "RU" },
  { name: "Itália", code: "IT" },
  { name: "Espanha", code: "ES" },
  { name: "México", code: "MX" },
  { name: "África do Sul", code: "ZA" },
  { name: "Turquia", code: "TR" },
  { name: "Egito", code: "EG" },
  { name: "Suécia", code: "SE" },
  { name: "Noruega", code: "NO" },
  { name: "Dinamarca", code: "DK" },
  { name: "Finlândia", code: "FI" },
  { name: "Polônia", code: "PL" },
  { name: "Bélgica", code: "BE" },
  { name: "Países Baixos", code: "NL" },
  { name: "Suíça", code: "CH" },
  { name: "Áustria", code: "AT" },
  { name: "Grécia", code: "GR" },
  { name: "Portugal", code: "PT" },
  { name: "Irlanda", code: "IE" },
  { name: "República Tcheca", code: "CZ" },
  { name: "Hungria", code: "HU" },
  { name: "Romênia", code: "RO" },
  { name: "Bulgária", code: "BG" },
  { name: "Sérvia", code: "RS" },
  { name: "Croácia", code: "HR" },
  { name: "Eslovênia", code: "SI" },
  { name: "Eslováquia", code: "SK" },
  { name: "Islândia", code: "IS" },
  { name: "Malásia", code: "MY" },
  { name: "Cingapura", code: "SG" },
  { name: "Filipinas", code: "PH" },
  { name: "Indonésia", code: "ID" },
  { name: "Tailândia", code: "TH" },
  { name: "Vietnã", code: "VN" },
  { name: "Coréia do Sul", code: "KR" },
  { name: "Nova Zelândia", code: "NZ" },
  { name: "Colômbia", code: "CO" },
  { name: "Chile", code: "CL" },
  { name: "Peru", code: "PE" },
  { name: "Venezuela", code: "VE" },
  { name: "Equador", code: "EC" },
  { name: "Paraguai", code: "PY" },
  { name: "Uruguai", code: "UY" },
  { name: "Bolívia", code: "BO" },
  { name: "Costa Rica", code: "CR" },
  { name: "Panamá", code: "PA" },
  { name: "Cuba", code: "CU" },
  { name: "República Dominicana", code: "DO" },
  { name: "Honduras", code: "HN" },
  { name: "Guatemala", code: "GT" },
  { name: "El Salvador", code: "SV" },
  { name: "Nicarágua", code: "NI" },
  { name: "Jamaica", code: "JM" },
  { name: "Trinidad e Tobago", code: "TT" },
  { name: "Barbados", code: "BB" },
  { name: "Bahamas", code: "BS" },
  { name: "Saint Lucia", code: "LC" },
  { name: "São Vicente e Granadinas", code: "VC" },
  { name: "Antígua e Barbuda", code: "AG" },
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

  useEffect(() => {
    console.log("Registering click handler"); // Debug log
    registerClickHandler(onCountryClick);
  }, [correctCountry]); // Adicione correctCountry como dependência

  const generateQuestion = () => {
    const shuffledCountries = [...countries].sort(() => Math.random() - 0.5);
    const correct = shuffledCountries[0];
    setCorrectCountry(correct);
    setOptions(shuffledCountries.slice(0, 3));
    setGameStage("flag");
    setInstruction("Que país pertence a esta bandeira?");
    setClickedCountry(null); // Reset clicked country
  };

  const handleAnswer = (selectedCountry: Country) => {
    setClickedCountry(selectedCountry.name);

    if (selectedCountry.name === correctCountry?.name) {
      // Correct flag identification
      setGameStage("map");
      setInstruction(`Agora clique no mapa onde fica ${correctCountry.name}`);
    } else {
      // Wrong flag identification
      setWrongCount((prev) => prev + 1);
      alert(`Incorreto! A bandeira pertence a ${correctCountry?.name}`);
      generateQuestion();
    }
  };

  const handleMapClick = (countryName: string) => {
    console.log("handleMapClick called with:", countryName); // Debug log

    if (gameStage === "map" && correctCountry) {
      // Atualiza o país clicado para exibir na interface
      setClickedCountry(countryName);

      // Normaliza ambos os nomes para comparação robusta
      const normalizedClicked = normalizeCountryName(countryName);
      const normalizedCorrect = normalizeCountryName(correctCountry.name);

      console.log("Comparing countries:", {
        clicked: normalizedClicked,
        correct: normalizedCorrect,
      });

      if (normalizedClicked === normalizedCorrect) {
        setCorrectCount((prev) => prev + 1);
        alert(`Parabéns! Você acertou a localização de ${correctCountry.name}!`);
        generateQuestion();
      } else {
        setWrongCount((prev) => prev + 1);
        alert(`Incorreto! Você clicou em ${countryName}, mas a resposta correta é ${correctCountry.name}.`);
      }
    }
  };

  const onCountryClick = (countryFeature: any) => {
    console.log("onCountryClick called with:", countryFeature); // Debug log

    if (gameStage === "map") {
      if (!countryFeature || !countryFeature.properties) {
        console.error("Dados do país inválidos", countryFeature);
        return;
      }

      // Use o nome traduzido se existir, senão ISO, senão nome original
      const countryName = countryFeature.properties.translatedName || countryFeature.properties.name || countryFeature.properties.ISO_A3;

      console.log("Country name extracted:", countryName); // Debug log

      if (countryName) {
        handleMapClick(countryName);
      }
    }
  };

  return (
    <div className="quiz-container" style={styles.container}>
      {correctCountry && (
        <>
          <img
            src={`https://flagcdn.com/h240/${correctCountry.code.toLowerCase()}.png`}
            alt={`Bandeira de ${correctCountry.name}`}
            style={styles.flag}
          />
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
