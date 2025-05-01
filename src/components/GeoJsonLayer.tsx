import { useMemo, useState, useEffect } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function GeoJsonLayer({ geoData, onCountryClick }: { geoData: any; onCountryClick?: (country: any) => void }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Diagnóstico para verificar dados
  useEffect(() => {
    if (!geoData) {
      console.error("GeoData is null or undefined");
      return;
    }
    console.log("GeoData received:", geoData);

    if (!geoData.features || geoData.features.length === 0) {
      console.error("GeoData has no features array or it's empty", geoData);
    } else {
      console.log("Number of features:", geoData.features.length);
      // Exibir exemplo do primeiro feature
      console.log("Sample feature:", geoData.features[0]);
    }
  }, [geoData]);

  const countries = useMemo(() => {
    if (!geoData || !geoData.features) {
      console.warn("GeoJSON data is missing or has no features");
      return [];
    }

    const mappedCountries = geoData.features.map((feature: any) => {
      // Guard against missing or malformed geometry
      if (!feature || !feature.geometry || !feature.geometry.coordinates) {
        console.warn("Invalid feature found in GeoJSON data", feature);
        return { id: null, lines: [], surfaces: [] };
      }

      const countryId = feature.properties?.ISO_A3 || feature.properties?.id || feature.id || String(Math.random());
      const coordinates = feature.geometry.coordinates;
      let lines = [];
      let surfaces = [];

      try {
        if (feature.geometry.type === "Polygon") {
          // Process polygon lines
          lines = coordinates.map((ring: any) =>
            ring.map(([lon, lat]: [number, number]) => {
              const phi = lat * (Math.PI / 180);
              const theta = -lon * (Math.PI / 180);
              const x = 2 * Math.cos(phi) * Math.cos(theta);
              const y = 2 * Math.sin(phi);
              const z = 2 * Math.cos(phi) * Math.sin(theta);
              return new THREE.Vector3(x, y, z);
            })
          );

          // Create surface triangles for each ring
          coordinates.forEach((ring: any) => {
            if (ring.length < 3) return; // Skip if not enough points for triangulation

            // Create a center point (average of all vertices)
            const center = ring.reduce(
              (acc: [number, number], [lon, lat]: [number, number]) => {
                return [acc[0] + lon, acc[1] + lat];
              },
              [0, 0]
            );
            center[0] /= ring.length;
            center[1] /= ring.length;

            // Create triangles using center point (fan triangulation)
            const vertices = [];
            for (let i = 0; i < ring.length; i++) {
              // Current point
              const [lon1, lat1] = ring[i];
              const phi1 = lat1 * (Math.PI / 180);
              const theta1 = -lon1 * (Math.PI / 180);
              const x1 = 2 * Math.cos(phi1) * Math.cos(theta1);
              const y1 = 2 * Math.sin(phi1);
              const z1 = 2 * Math.cos(phi1) * Math.sin(theta1);

              // Next point
              const [lon2, lat2] = ring[(i + 1) % ring.length];
              const phi2 = lat2 * (Math.PI / 180);
              const theta2 = -lon2 * (Math.PI / 180);
              const x2 = 2 * Math.cos(phi2) * Math.cos(theta2);
              const y2 = 2 * Math.sin(phi2);
              const z2 = 2 * Math.cos(phi2) * Math.sin(theta2);

              // Center point
              const phiC = center[1] * (Math.PI / 180);
              const thetaC = -center[0] * (Math.PI / 180);
              const xC = 2 * Math.cos(phiC) * Math.cos(thetaC);
              const yC = 2 * Math.sin(phiC);
              const zC = 2 * Math.cos(phiC) * Math.sin(thetaC);

              vertices.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2), new THREE.Vector3(xC, yC, zC));
            }

            surfaces.push(vertices);
          });
        } else if (feature.geometry.type === "MultiPolygon") {
          // Process multipolygon lines
          lines = coordinates.flatMap((polygon: any) =>
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

          // Create surface triangles for each ring in each polygon
          coordinates.forEach((polygon: any) => {
            polygon.forEach((ring: any) => {
              if (ring.length < 3) return; // Skip if not enough points

              // Create a center point (average of all vertices)
              const center = ring.reduce(
                (acc: [number, number], [lon, lat]: [number, number]) => {
                  return [acc[0] + lon, acc[1] + lat];
                },
                [0, 0]
              );
              center[0] /= ring.length;
              center[1] /= ring.length;

              // Create triangles using center point (fan triangulation)
              const vertices = [];
              for (let i = 0; i < ring.length; i++) {
                // Current point
                const [lon1, lat1] = ring[i];
                const phi1 = lat1 * (Math.PI / 180);
                const theta1 = -lon1 * (Math.PI / 180);
                const x1 = 2 * Math.cos(phi1) * Math.cos(theta1);
                const y1 = 2 * Math.sin(phi1);
                const z1 = 2 * Math.cos(phi1) * Math.sin(theta1);

                // Next point
                const [lon2, lat2] = ring[(i + 1) % ring.length];
                const phi2 = lat2 * (Math.PI / 180);
                const theta2 = -lon2 * (Math.PI / 180);
                const x2 = 2 * Math.cos(phi2) * Math.cos(theta2);
                const y2 = 2 * Math.sin(phi2);
                const z2 = 2 * Math.cos(phi2) * Math.sin(theta2);

                // Center point
                const phiC = center[1] * (Math.PI / 180);
                const thetaC = -center[0] * (Math.PI / 180);
                const xC = 2 * Math.cos(phiC) * Math.cos(thetaC);
                const yC = 2 * Math.sin(phiC);
                const zC = 2 * Math.cos(phiC) * Math.sin(thetaC);

                vertices.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2), new THREE.Vector3(xC, yC, zC));
              }

              surfaces.push(vertices);
            });
          });
        }
      } catch (error) {
        console.error(`Error processing feature ${countryId}:`, error);
        return { id: countryId, lines: [], surfaces: [] };
      }

      return { id: countryId, lines, surfaces };
    });

    console.log("Processed countries:", mappedCountries.length);

    return mappedCountries;
  }, [geoData]);

  const handlePointerOver = (countryId: string) => {
    setHoveredCountry(countryId);
  };

  const handlePointerOut = () => {
    setHoveredCountry(null);
  };

  // Add this to your GeoJsonLayer.tsx
  const handleCountryClick = (countryId: string) => {
    // Find the corresponding GeoJSON feature
    if (!geoData || !geoData.features) {
      console.error("GeoJSON data missing when handling click:", geoData);
      if (onCountryClick) onCountryClick(null);
      return;
    }

    console.log("Searching for country with ID:", countryId);

    // O ID 0.7939822763661399 é um número aleatório gerado quando não há ID confiável
    // Precisamos encontrar o país correto usando outros meios

    // Primeiro, tente encontrar pela correspondência exata de ID
    let countryFeature = geoData.features.find((feature: any) => {
      const featureId = feature.properties?.ISO_A3 || feature.properties?.id || feature.id;
      return featureId === countryId;
    });

    // Se não encontrou por ID exato, tente usar informações de localização
    if (!countryFeature && typeof countryId === "string" && countryId.includes(".")) {
      // Provavelmente temos um ID aleatório - vamos procurar o país por nome em vez disso
      // Vamos listar alguns dos países disponíveis para debugging
      console.log("Não foi possível encontrar por ID, procurando por nome...");

      // Listar alguns países para debugging
      console.log(
        "Alguns países disponíveis:",
        geoData.features.slice(0, 5).map((f: any) => ({
          name: f.properties?.name || f.properties?.NAME,
          id: f.properties?.ISO_A3 || f.id,
        }))
      );

      // Vai usar o primeiro país encontrado para debugging
      // Na aplicação real, você usaria informações de coordenadas para determinar o país clicado
      if (geoData.features.length > 0) {
        countryFeature = geoData.features[0];
        console.log("Usando o primeiro país disponível para debugging:", countryFeature);
      }
    }

    if (countryFeature && onCountryClick) {
      console.log("Country click detected:", countryFeature);
      onCountryClick(countryFeature);
    } else {
      console.error("Could not find country data for ID:", countryId, "Available features:", geoData.features.length);

      // Adiciona informações detalhadas de debug
      console.log(
        "Debug - primeiros 3 países no dataset:",
        geoData.features.slice(0, 3).map((f: any) => ({
          name: f.properties?.name || f.properties?.NAME,
          ISO_A3: f.properties?.ISO_A3,
          id: f.id,
          properties: Object.keys(f.properties || {}),
        }))
      );

      // Procurar por países que podem ser relevantes usando nomes conhecidos
      const debugCountries = ["Germany", "Brasil", "United States", "France", "Japan"];
      const foundCountries = geoData.features.filter((f: any) => debugCountries.includes(f.properties?.name || f.properties?.NAME));
      console.log(
        "Países conhecidos encontrados no dataset:",
        foundCountries.map((f: any) => f.properties?.name || f.properties?.NAME)
      );

      // Se não encontrou país correspondente, ainda chame o handler com um objeto temporário
      if (onCountryClick) {
        onCountryClick({
          id: countryId,
          properties: {
            id: countryId,
            name: "Unknown Country", // Adiciona um nome padrão para evitar erros
          },
        });
      }
    }
  };

  return (
    <>
      {countries.length > 0 ? (
        <>
          {/* Render country fill areas (invisible but interactive) */}
          {countries.map((country) =>
            country.id && country.surfaces.length > 0
              ? country.surfaces.map((vertices, i) => (
                  <mesh
                    key={`surface-${country.id}-${i}`}
                    onPointerOver={() => handlePointerOver(country.id)}
                    onPointerOut={handlePointerOut}
                    // Adicione o evento onClick aqui
                    onClick={() => handleCountryClick(country.id)}
                  >
                    <bufferGeometry>
                      <bufferAttribute
                        attach="attributes-position"
                        array={new Float32Array(vertices.flatMap((v) => [v.x, v.y, v.z]))}
                        count={vertices.length}
                        itemSize={3}
                      />
                    </bufferGeometry>
                    <meshBasicMaterial transparent opacity={0.0} side={THREE.DoubleSide} />
                  </mesh>
                ))
              : null
          )}

          {/* Render country borders */}
          {countries.map((country) =>
            country.id && country.lines.length > 0
              ? country.lines.map((points, i) => (
                  <Line key={`line-${country.id}-${i}`} points={points} color={hoveredCountry === country.id ? "red" : "white"} lineWidth={2} />
                ))
              : null
          )}
        </>
      ) : (
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </>
  );
}
