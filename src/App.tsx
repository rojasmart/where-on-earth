import Globe from "./components/Globe";
import Questions from "./components/Questions";

function App() {
  // Exemplo de país com código ISO 3166-1 alpha-2
  const countryName = "Brasil";
  const countryCode = "br"; // Código do país em minúsculas (ISO 3166-1 alpha-2)
  const flagUrl = `https://flagcdn.com/w320/${countryCode}.png`;

  return (
    <>
      <Questions flagUrl={flagUrl} countryName={countryName} />
      <Globe />
    </>
  );
}

export default App;
