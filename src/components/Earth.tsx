// src/components/Earth.tsx
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Earth() {
  const earthMap = useLoader(TextureLoader, "/assets/earthmap.jpg");

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={earthMap} />
    </mesh>
  );
}
