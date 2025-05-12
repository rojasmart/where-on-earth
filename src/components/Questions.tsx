import { useState, useEffect } from "react";

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

export default function Questions({
  registerClickHandler,
  score,
  onClickedCountryChange,
}: {
  registerClickHandler: (handler: (country: any) => void) => void;
  score: number;
  onClickedCountryChange: (code: string | null) => void; // Add this type
}) {
  const [correctCountry, setCorrectCountry] = useState<Country | null>(null);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameStage, setGameStage] = useState<"flag" | "map">("flag");
  const [instruction, setInstruction] = useState<string>("");

  const [attempts, setAttempts] = useState(3);

  useEffect(() => {
    generateQuestion();
  }, []);

  // Atualiza a pergunta sempre que o score mudar
  useEffect(() => {
    generateQuestion();
  }, [score]);

  const generateQuestion = () => {
    const shuffledCountries = [...countries].sort(() => Math.random() - 0.5);
    const correct = shuffledCountries[0];
    setCorrectCountry(correct);
    setOptions(shuffledCountries.slice(0, 3));
    setGameStage("flag");
    setInstruction("Que país pertence a esta bandeira?");
    setClickedCountry(null);
    onClickedCountryChange(null);
    setAttempts(3); // Reset attempts for new question
  };

  const handleAnswer = (selectedCountry: Country) => {
    if (gameStage !== "flag") return;

    setClickedCountry(selectedCountry.code);
    onClickedCountryChange(selectedCountry.code); // Add this line

    if (selectedCountry.code === correctCountry?.code) {
      setGameStage("map");
      setInstruction(`Agora clique no mapa onde fica ${correctCountry.name}`);
      setAttempts(3); // Reset attempts for next question
    } else {
      setAttempts((prev) => prev - 1);
      if (attempts > 1) {
        alert(`Incorreto! Você ainda tem ${attempts - 1} tentativas.`);
      } else {
        alert(`Você esgotou suas tentativas! A resposta correta era ${correctCountry?.name}`);
        setScore(0); // Reset score
        generateQuestion(); // Get new question
        setAttempts(3); // Reset attempts
      }
    }
  };

  const onCountryClick = (countryFeature: any) => {
    if (!countryFeature || !countryFeature.properties) return;
    if (gameStage !== "map" || !correctCountry) return;

    const clickedIso2 = (countryFeature.properties["ISO3166-1-Alpha-2"] || countryFeature.properties.ISO_A2)?.toUpperCase();

    if (clickedIso2 === correctCountry.code) {
      setCorrectCount((prev) => prev + 1);
      alert(`Parabéns! Você acertou a localização de ${correctCountry.name}!`);

      generateQuestion(); // Reseta a pergunta
      setGameStage("flag");
    } else {
      setWrongCount((prev) => prev + 1);
      const clickedName = countryFeature.properties.translatedName || countryFeature.properties.name || clickedIso2;
      alert(`Incorreto! Você clicou em ${clickedName}, mas a resposta correta é ${correctCountry.name}`);
    }
  };

  useEffect(() => {
    if (gameStage === "map" && correctCountry) {
      registerClickHandler(onCountryClick);
    }
  }, [correctCountry, gameStage]);

  return (
    <div className="quiz-container">
      {correctCountry && (
        <>
          <img
            src={`https://flagcdn.com/h240/${correctCountry.code.toLowerCase()}.png`}
            alt={`Bandeira de ${correctCountry.name}`}
            className="quiz-flag"
          />
          <p className="quiz-question">{instruction}</p>

          {gameStage === "flag" && (
            <div className="quiz-options">
              {options.map((country) => (
                <button key={country.code} onClick={() => handleAnswer(country)} className="quiz-option-button">
                  {country.name}
                </button>
              ))}
            </div>
          )}

          {gameStage === "map" && <div className="quiz-map-instruction">Clique no país correto no mapa!</div>}

          <div className="quiz-score">
            <p>Corretas: {score}</p>
            <p>Erradas: {wrongCount}</p>
          </div>
          <div className="quiz-clicked-country">
            <h3>País Selecionado:</h3>
            <p>{clickedCountry || "Nenhum país selecionado"}</p>
          </div>
        </>
      )}
    </div>
  );
}
