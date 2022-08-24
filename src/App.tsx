import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const URL = "https://biapi.nve.no/magasinstatistikk/api/Magasinstatistikk/HentOffentligDataSisteUke";

export interface ReservoirStatisticsModel {
  dato_Id: string;
  omrType: string;
  omrnr: number;
  iso_aar: number;
  iso_uke: number;
  fyllingsgrad: number;
  kapasitet_TWh: number;
  fylling_TWh: number;
  neste_Publiseringsdato: string;
  fyllingsgrad_forrige_uke: number;
  endring_fyllingsgrad: number;
}

function App() {
  const { data, isLoading, isError } = useQuery(["last_week"], async () => {
    const response = await axios.get<ReservoirStatisticsModel[]>(URL);
    const nationalData = response.data.find((x) => x.omrnr === 0 && x.omrType === "NO");

    return nationalData;
  });

  if (isError) {
    return <div>Obs! Noe gikk galt.</div>;
  }

  if (isLoading) {
    return <div>Laster inn...</div>;
  }

  if (!data) {
    return <div>Vi har fått data enda, kom tilbake senere!</div>;
  }

  const degreeOfFilling = Math.round(+data.fyllingsgrad * 1000) / 10;
  const deltaDegreeOfFilling = Math.round(+data.endring_fyllingsgrad * 1000) / 10;

  return (
    <div>
      <h1>{degreeOfFilling}%</h1>
      <p className="bold">
        {deltaDegreeOfFilling > 0 ? (
          <>
            🎉 Opp <span className="text-green">{deltaDegreeOfFilling}%</span> fra forrige uke 🎉
          </>
        ) : (
          <>
            ☹️ Ned <span className="text-red">{deltaDegreeOfFilling}%</span> fra forrige uke ☹️
          </>
        )}
      </p>
      <p className="text-sm mt-7">
        <span>Kilde: </span>
        <a href="http://api.nve.no/doc/magasinstatistikk/" target="_blank" rel="noopener noreferrer">
          http://api.nve.no/doc/magasinstatistikk/
        </a>
      </p>
    </div>
  );
}

export default App;
