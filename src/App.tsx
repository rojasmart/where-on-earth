import { useState } from "react";
import Globe from "./components/Globe";
import Questions from "./components/Questions";

function App() {
  const [pinCoordinates, setPinCoordinates] = useState<[number, number] | null>(null);
  const [onCountryClickHandler, setOnCountryClickHandler] = useState<((country: any) => void) | null>(null);
  const [score, setScore] = useState(0);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(3);

  // Function to receive the click handler from Questions component
  const registerCountryClickHandler = (handler: (country: any) => void) => {
    setOnCountryClickHandler(handler);
  };

  // Função para atualizar o score
  const onScoreUpdate = (newScore: number) => {
    setScore(newScore); // Atualiza o estado do score
  };
  // Função para incrementar o score
  const incrementScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  // Função para decrementar o score
  const decrementScore = () => {
    setScore((prevScore) => Math.max(0, prevScore - 1)); // Não permitir score negativo
  };
  return (
    <div className="container">
      <div className="left-panel">
        <Questions
          registerClickHandler={registerCountryClickHandler}
          score={score}
          onClickedCountryChange={setClickedCountry}
          onScoreReset={() => setScore(0)}
          incrementScore={incrementScore}
          decrementScore={decrementScore}
          attempts={attempts}
          setAttempts={setAttempts} // Certifique-se que isso está presente
        />
      </div>
      <div className="right-panel">
        <Globe
          pinCoordinates={pinCoordinates}
          onCountryClick={onCountryClickHandler ?? undefined}
          onScoreUpdate={onScoreUpdate}
          highlightedCountry={clickedCountry}
          attempts={attempts}
          onAttemptsUpdate={setAttempts}
        />
      </div>
    </div>
  );
}

export default App;
