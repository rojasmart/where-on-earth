import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import Earth from "./Earth";
import GeoJsonLayer from "./GeoJsonLayer";

export default function Globe({
  pinCoordinates,
  onCountryClick,
  onGenerateQuestion,
  onScoreUpdate,
}: {
  pinCoordinates: [number, number] | null;
  onCountryClick?: (country: any) => void;
  onGenerateQuestion?: () => void;
  onScoreUpdate?: (newScore: number) => void;
}) {
  const [geoData, setGeoData] = useState(null);
  const [pinPosition, setPinPosition] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    fetch("/data/countries.json")
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  useEffect(() => {
    if (pinCoordinates) {
      const [lon, lat] = pinCoordinates;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = 2 * Math.sin(phi) * Math.cos(theta);
      const y = 2 * Math.cos(phi);
      const z = 2 * Math.sin(phi) * Math.sin(theta);
      setPinPosition(new THREE.Vector3(x, y, z));
    }
  }, [pinCoordinates]);

  return (
    <Canvas style={{ width: "65vw", height: "100vh" }} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={4} />
      <directionalLight position={[5, 5, 5]} />
      <Stars />
      <Earth />
      {geoData && (
        <GeoJsonLayer
          geoData={geoData}
          onCountryClick={onCountryClick} // Passa o handler de clique
          onGenerateQuestion={onGenerateQuestion} // Passa a função para gerar perguntas
          onScoreUpdate={onScoreUpdate} // Passa a função para atualizar o score
        />
      )}
      {pinPosition && (
        <mesh position={pinPosition}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
      <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
    </Canvas>
  );
}
