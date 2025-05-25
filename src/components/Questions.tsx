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
  { name: "São Cristóvão e Nevis", code: "KN" },
  { name: "Dominica", code: "DM" },
  { name: "Grenada", code: "GD" },
  { name: "Belize", code: "BZ" },
  { name: "Haiti", code: "HT" },
  { name: "República Centro-Africana", code: "CF" },
  { name: "Camarões", code: "CM" },
  { name: "Gana", code: "GH" },
  { name: "Quênia", code: "KE" },
  { name: "Tanzânia", code: "TZ" },
  { name: "Uganda", code: "UG" },
  { name: "Zâmbia", code: "ZM" },
  { name: "Zimbábue", code: "ZW" },
  { name: "Angola", code: "AO" },
  { name: "Moçambique", code: "MZ" },
  { name: "Namíbia", code: "NA" },
  { name: "Botsuana", code: "BW" },
  { name: "Lesoto", code: "LS" },
  { name: "Suazilândia", code: "SZ" },
  { name: "Malawi", code: "MW" },
  { name: "Cabo Verde", code: "CV" },
  { name: "Guiné-Bissau", code: "GW" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Seychelles", code: "SC" },
  { name: "Comores", code: "KM" },
  { name: "Djibuti", code: "DJ" },
  { name: "Eritreia", code: "ER" },
  { name: "Somália", code: "SO" },
  { name: "Sudão do Sul", code: "SS" },
  { name: "Sudão", code: "SD" },
  { name: "Chade", code: "TD" },
  { name: "República do Congo", code: "CG" },
  { name: "República Democrática do Congo", code: "CD" },
  { name: "Gabão", code: "GA" },
  { name: "Guiné Equatorial", code: "GQ" },
  { name: "São Tomé e Príncipe", code: "ST" },
  { name: "Iémen", code: "YE" },
  { name: "Omã", code: "OM" },
  { name: "Jordânia", code: "JO" },
  { name: "Líbano", code: "LB" },
  { name: "Síria", code: "SY" },
  { name: "Irã", code: "IR" },
  { name: "Iraque", code: "IQ" },
  { name: "Afeganistão", code: "AF" },
  { name: "Paquistão", code: "PK" },
  { name: "Bangladesh", code: "BD" },
  { name: "Nepal", code: "NP" },
  { name: "Butão", code: "BT" },
  { name: "Maldivas", code: "MV" },
  { name: "Mianmar", code: "MM" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Cazaquistão", code: "KZ" },
  { name: "Uzbequistão", code: "UZ" },
  { name: "Quirguistão", code: "KG" },
  { name: "Tajiquistão", code: "TJ" },
  { name: "Turcomenistão", code: "TM" },
  { name: "Armênia", code: "AM" },
  { name: "Azerbaijão", code: "AZ" },
  { name: "Geórgia", code: "GE" },
  { name: "Moldávia", code: "MD" },
  { name: "Bielorrússia", code: "BY" },
  { name: "Ucrânia", code: "UA" },
  { name: "Bósnia e Herzegovina", code: "BA" },
  { name: "Macedônia do Norte", code: "MK" },
  { name: "Albânia", code: "AL" },
  { name: "Kosovo", code: "XK" },
  { name: "Montenegro", code: "ME" },
];

export default function Questions({
  registerClickHandler,
  score,
  onClickedCountryChange,
  onScoreReset,
  incrementScore,
  decrementScore,
  attempts,
  setAttempts,
}: {
  registerClickHandler: (handler: (country: any) => void) => void;
  score: number;
  onClickedCountryChange: (code: string | null) => void;
  onScoreReset: () => void;
  incrementScore: () => void;
  decrementScore: () => void;
  attempts: number;
  setAttempts: (attempts: number) => void;
}) {
  const [correctCountry, setCorrectCountry] = useState<Country | null>(null);

  const [options, setOptions] = useState<Country[]>([]);

  const [gameStage, setGameStage] = useState<"flag" | "map">("flag");
  const [instruction, setInstruction] = useState<string>("");
  const [scoreAnimating, setScoreAnimating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {
    // Inicialização do jogo - definir tentativas apenas uma vez no início
    if (typeof setAttempts === "function") {
      console.log("Inicializando tentativas para 3");
      setAttempts(3);
    } else {
      console.warn("setAttempts não é uma função válida");
    }

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
    setInstruction("A que país pertence esta bandeira? Tem 3 tentativas para completar o desafio.");

    onClickedCountryChange(null);
    // Não resetar tentativas a cada nova pergunta, apenas quando o score é zerado
    // O reset de tentativas acontecerá apenas quando o jogador esgotar todas as tentativas
  };
  const handleAnswer = (selectedCountry: Country) => {
    if (gameStage !== "flag") return;

    onClickedCountryChange(selectedCountry.code);
    if (selectedCountry.code === correctCountry?.code) {
      setGameStage("map");
      setSuccessMessage(`Correto! Agora encontre ${correctCountry.name} no mapa.`);
      setTimeout(() => setSuccessMessage(null), 2000); // Remove message after 2 seconds
      setInstruction(`Agora clique no mapa onde fica ${correctCountry.name}. Você tem ${attempts} tentativa(s) restante(s).`);
    } else {
      setAttempts((prev) => prev - 1);
      // Incrementar contador de erros

      // Decrementar o score quando errar na identificação da bandeira
      decrementScore();
      if (attempts > 1) {
        alert(`Incorreto! Você ainda tem ${attempts - 1} tentativas.`);
      } else {
        alert(`Você esgotou suas tentativas! A resposta correta era ${correctCountry?.name}`);
        onScoreReset(); // Zerar o score

        generateQuestion(); // Get new question
        setAttempts(3); // Reset attempts apenas quando zerar o score
      }
    }
  };
  const onCountryClick = (countryFeature: any) => {
    if (!countryFeature || !countryFeature.properties) return;
    if (gameStage !== "map" || !correctCountry) return;

    const clickedIso2 = (countryFeature.properties["ISO3166-1-Alpha-2"] || countryFeature.properties.ISO_A2)?.toUpperCase();
    if (clickedIso2 === correctCountry.code) {
      // Incrementar o contador de acertos
      incrementScore();

      // Mostrar mensagem de sucesso em vez de alert
      setSuccessMessage(`Parabéns! Você acertou a localização de ${correctCountry.name}!`);

      // Animação do score acontecerá
      setScoreAnimating(true);

      // Remover mensagem após 2 segundos
      setTimeout(() => {
        setSuccessMessage(null);
        setScoreAnimating(false);

        // Resetar pergunta e voltar para estágio flag
        generateQuestion();
        setGameStage("flag");
      }, 2000);
    } else {
      setAttempts((prev) => prev - 1);

      // Decrementar o score quando errar no mapa
      decrementScore();
      const clickedName = countryFeature.properties.translatedName || countryFeature.properties.name || clickedIso2;

      if (attempts > 1) {
        alert(
          `Incorreto! Você clicou em ${clickedName}, mas a resposta correta é ${correctCountry.name}. Você ainda tem ${attempts - 1} tentativa(s).`
        );
      } else {
        alert(`Você esgotou suas tentativas! A resposta correta era ${correctCountry.name}`);
        onScoreReset(); // Zerar o score

        generateQuestion(); // Get new question
        setAttempts(3); // Reset attempts apenas quando zerar o score
      }
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
          {gameStage === "map" && (
            <div className="quiz-map-instruction">Clique no país correto no mapa! Você tem {attempts} tentativa(s) restante(s).</div>
          )}{" "}
          <div className="quiz-score">
            <p>Tentativas restantes para completar o desafio: {attempts}</p>
            <p className={scoreAnimating ? "score-animate" : ""}>Corretas: {score}</p>
          </div>
          {successMessage && <div className="success-message">{successMessage}</div>}
        </>
      )}
    </div>
  );
}
