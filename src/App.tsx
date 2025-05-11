import { useState } from "react";
import Globe from "./components/Globe";
import Questions from "./components/Questions";

function App() {
  const [pinCoordinates, setPinCoordinates] = useState<[number, number] | null>(null);
  const [onCountryClickHandler, setOnCountryClickHandler] = useState<((country: any) => void) | null>(null);

  const [score, setScore] = useState(0);

  // Function to receive the click handler from Questions component
  const registerCountryClickHandler = (handler: (country: any) => void) => {
    setOnCountryClickHandler(handler);
  };

  // Function to handle generating a new question
  const handleGenerateQuestion = () => {
    console.log("Generating a new question...");
    // Adicione lógica para gerar uma nova pergunta, se necessário
  };

  // Function to handle score updates
  const handleScoreUpdate = (newScore: number) => {
    console.log("Updating score:", newScore);
    setScore(newScore);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <Questions registerClickHandler={registerCountryClickHandler} onGenerateQuestion={handleGenerateQuestion} onScoreUpdate={handleScoreUpdate} />
      </div>
      <div style={styles.rightPanel}>
        <Globe
          pinCoordinates={pinCoordinates}
          onCountryClick={onCountryClickHandler ?? undefined}
          onGenerateQuestion={handleGenerateQuestion} // Passa para o Globe
          onScoreUpdate={handleScoreUpdate} // Passa para o Globe
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    height: "100vh",
    width: "100vw",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: "20px",
    overflowY: "auto" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rightPanel: {
    flex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
};

export default App;
