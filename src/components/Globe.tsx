import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "./Earth";
import GeoJsonLayer from "./GeoJsonLayer";

export default function Globe() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/data/countries.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  return (
    <Canvas style={{ width: "50vw", height: "50vh" }} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={4} />
      <directionalLight position={[5, 5, 5]} />
      <Stars />
      <Earth />
      {geoData && <GeoJsonLayer geoData={geoData} />}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
