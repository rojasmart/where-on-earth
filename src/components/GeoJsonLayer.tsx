import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function GeoJsonLayer({ geoData }: { geoData: any }) {
  const lines = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((feature: any) => {
      const coordinates = feature.geometry.coordinates;
      if (feature.geometry.type === "Polygon") {
        return coordinates.map((ring: any) =>
          ring.map(([lon, lat]: [number, number]) => {
            const phi = (90 - lat) * (Math.PI / 180); // Latitude invertida
            const theta = (lon + 180) * (Math.PI / 180);
            const x = 2 * Math.sin(phi) * Math.cos(theta);
            const y = 2 * Math.cos(phi);
            const z = 2 * Math.sin(phi) * Math.sin(theta);
            return new THREE.Vector3(x, y, z);
          })
        );
      } else if (feature.geometry.type === "MultiPolygon") {
        return coordinates.flatMap((polygon: any) =>
          polygon.map((ring: any) =>
            ring.map(([lon, lat]: [number, number]) => {
              const phi = (90 - lat) * (Math.PI / 180); // Latitude invertida
              const theta = (lon + 180) * (Math.PI / 180);
              const x = 2 * Math.sin(phi) * Math.cos(theta);
              const y = 2 * Math.cos(phi);
              const z = 2 * Math.sin(phi) * Math.sin(theta);
              return new THREE.Vector3(x, y, z);
            })
          )
        );
      }
      return [];
    });
  }, [geoData]);

  return (
    <>
      {lines.map((line: any, index: number) =>
        line.map((points: any, i: number) => <Line key={`${index}-${i}`} points={points} color="white" lineWidth={1} />)
      )}
    </>
  );
}
