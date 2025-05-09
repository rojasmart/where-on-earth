import { useMemo, useState, useEffect } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function GeoJsonLayer({ geoData, onCountryClick }: { geoData: any; onCountryClick?: (country: any) => void }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const gameCountryMap = {
    FRA: "França",
    BRA: "Brasil",
    USA: "Estados Unidos",
    DEU: "Alemanha",
    JPN: "Japão",
  };

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

    // Primeiro, filtra features inválidas
    const validFeatures = geoData.features.filter((feature) => feature && feature.geometry && feature.geometry.coordinates);

    // Log único de resumo em vez de múltiplos avisos
    if (validFeatures.length < geoData.features.length) {
      console.warn(`Filtered out ${geoData.features.length - validFeatures.length} invalid features from GeoJSON`);
    }

    const mappedCountries = geoData.features.map((feature: any, index: number) => {
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

  const handleCountryClick = (countryId: string) => {
    setSelectedCountry(countryId);

    if (!geoData || !geoData.features) {
      console.error("GeoJSON data missing when handling click:", geoData);
      if (onCountryClick) onCountryClick(null);
      return;
    }

    // Primeiro, tenta encontrar o país pelo índice
    const countryIndex = countries.findIndex((country) => country.id === countryId);

    if (countryIndex >= 0) {
      const countryFeature = geoData.features[countryIndex];

      // Log detalhado para debug
      console.log("País encontrado pelo índice:", {
        index: countryIndex,
        feature: countryFeature,
        properties: countryFeature.properties,
      });

      // Verifica se é um dos países do jogo usando várias propriedades
      const iso = countryFeature.properties?.ISO_A3 || countryFeature.properties?.["ISO3166-1-Alpha-3"];

      if (iso && gameCountryMap[iso]) {
        // Adiciona o nome em português às propriedades
        countryFeature.properties.name = gameCountryMap[iso];
        console.log(`País do jogo identificado: ${gameCountryMap[iso]}`);

        if (onCountryClick) {
          onCountryClick({
            ...countryFeature,
            properties: {
              ...countryFeature.properties,
              name: gameCountryMap[iso],
              ISO_A3: iso,
            },
          });
          return;
        }
      }
    }

    // Fallback: procura o país diretamente nos features
    const targetCountry = geoData.features.find((feature) => {
      const iso = feature.properties?.ISO_A3 || feature.properties?.["ISO3166-1-Alpha-3"];
      return iso === "DEU" || iso === "BRA" || iso === "USA" || iso === "FRA" || iso === "JPN";
    });

    if (targetCountry && onCountryClick) {
      const iso = targetCountry.properties?.ISO_A3 || targetCountry.properties?.["ISO3166-1-Alpha-3"];

      // Garante que o país tenha o nome em português
      targetCountry.properties.name = gameCountryMap[iso];
      console.log("País encontrado por ISO:", targetCountry);
      onCountryClick(targetCountry);
    } else {
      console.error("País não encontrado:", {
        countryId,
        availableFeatures: geoData.features.length,
      });
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
                    onClick={() => handleCountryClick(country.id)}
                    renderOrder={selectedCountry === country.id ? 1 : 0}
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
                  <Line
                    key={`line-${country.id}-${i}`}
                    points={points}
                    color={selectedCountry === country.id ? "red" : hoveredCountry === country.id ? "#ff8888" : "white"}
                    lineWidth={selectedCountry === country.id ? 3 : hoveredCountry === country.id ? 2 : 1}
                    renderOrder={selectedCountry === country.id ? 2 : 1}
                  />
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
