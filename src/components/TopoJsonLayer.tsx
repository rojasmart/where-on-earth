import { useMemo, useState, useCallback } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { feature } from "topojson-client";

export default function TopoJsonLayer({ topoData }: { topoData: any }) {
  const [hoveredCountry, setHoveredCountry] = useState<number | null>(null);

  const lines = useMemo(() => {
    if (!topoData) return [];
    const geoJson = feature(topoData, topoData.objects.countries); // Ajuste conforme o nome do objeto TopoJSON
    return geoJson.features.map((feature: any) => {
      const coordinates = feature.geometry.coordinates;
      if (feature.geometry.type === "Polygon") {
        return coordinates.map((ring: any) =>
          ring.map(([lon, lat]: [number, number]) => {
            const phi = lat * (Math.PI / 180);
            const theta = -lon * (Math.PI / 180);
            const x = 2 * Math.cos(phi) * Math.cos(theta);
            const y = 2 * Math.sin(phi);
            const z = 2 * Math.cos(phi) * Math.sin(theta);
            return new THREE.Vector3(x, y, z);
          })
        );
      } else if (feature.geometry.type === "MultiPolygon") {
        return coordinates.flatMap((polygon: any) =>
          polygon.map((ring: any) =>
            ring.map(([lon, lat]: [number, number]) => {
              const phi = lat * (Math.PI / 180);
              const theta = -lon * (Math.PI / 180);
              const x = 2 * Math.cos(phi) * Math.cos(theta);
              const y = 2 * Math.sin(phi);
              const z = 2 * Math.cos(phi) * Math.sin(theta);
              return new THREE.Vector3(x, y, z);
            })
          )
        );
      }
      return [];
    });
  }, [topoData]);

  const handlePointerOver = useCallback(
    (index: number) => {
      if (hoveredCountry !== index) {
        setHoveredCountry(index);
      }
    },
    [hoveredCountry]
  );

  const handlePointerOut = useCallback(
    (index: number) => {
      if (hoveredCountry === index) {
        setHoveredCountry(null);
      }
    },
    [hoveredCountry]
  );

  return (
    <>
      {lines.map((line: any, index: number) =>
        line.map((points: any, i: number) => (
          <Line
            key={`${index}-${i}`}
            points={points}
            color={hoveredCountry === index ? "red" : "white"}
            lineWidth={1}
            onPointerOver={() => handlePointerOver(index)}
            onPointerOut={() => handlePointerOut(index)}
          />
        ))
      )}
    </>
  );
}
