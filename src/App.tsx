import { useState } from "react";
import Globe from "./components/Globe";
import Questions from "./components/Questions";

function App() {
  const [pinCoordinates, setPinCoordinates] = useState<[number, number] | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <Questions onPin={setPinCoordinates} />
      </div>
      <div style={styles.rightPanel}>
        <Globe pinCoordinates={pinCoordinates} />
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
