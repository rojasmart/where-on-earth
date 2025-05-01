import { useState } from "react";
import Globe from "./components/Globe";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Welcome to the 3D Globe App</h1>
        <p>This is a simple app to demonstrate a 3D globe using React and Three.js.</p>
        <button onClick={() => setCount(count + 1)}>Count is: {count}</button>
      </div>
      <Globe />
    </>
  );
}

export default App;
