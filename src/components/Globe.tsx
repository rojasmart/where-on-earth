import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "./Earth";
import TopoJsonLayer from "./TopoJsonLayer";

export default function Globe({ pinCoordinates }: { pinCoordinates: [number, number] | null }) {
  const [topoData, setTopoData] = useState(null);

  useEffect(() => {
    fetch("/data/countries.json") // Certifique-se de usar um arquivo TopoJSON
      .then((response) => response.json())
      .then((data) => setTopoData(data))
      .catch((error) => console.error("Error loading TopoJSON:", error));
  }, []);

  return (
    <Canvas style={{ width: "65vw", height: "100vh" }} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={4} />
      <directionalLight position={[5, 5, 5]} />
      <Stars />
      <Earth />
      {topoData && <TopoJsonLayer topoData={topoData} />}

      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
