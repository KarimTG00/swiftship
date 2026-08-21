import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowUpRight, Box, MapPin, PackageSearch, Truck } from "lucide-react";
import { suivreColis } from "../api/tracking";
import BarreProgression from "../components/BarreProgression";
import Timeline from "../components/Timeline";
import CarteItineraire from "../components/CarteItineraire";
import { arriveeAjustee } from "../domaine/progression";
import Footer from "../components/footer";
import WidgetChat from "../components/WidgetChat";
import MapItineraire from "../components/itineraire";

const LIBELLES_TYPE = {
  STANDARD: "Livraison standard",
  EXPRESS: "Livraison express",
  INTER_VILLE: "Livraison inter-ville",
  DOMICILE: "Livraison à domicile",
};

function dateLongue(valeur) {
  if (!valeur) return null;
  return new Date(valeur).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

// Une fiche n'est affichée que si elle contient au moins une information :
// mieux vaut la masquer qu'afficher un bloc vide.
function Fiche({ titre, lignes }) {
  const remplies = lignes.filter(([, valeur]) => valeur);
  if (remplies.length === 0) return null;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 h-fit">
      <h2 className="text-xl font-bold mb-4">{titre}</h2>
      <dl className="space-y-2">
        {remplies.map(([cle, valeur]) => (
          <div
            key={cle}
            className="flex justify-between gap-4 border-b border-gray-100 py-1"
          >
            <dt className="text-gray-500 shrink-0">{cle}</dt>
            <dd className="text-right font-medium break-words">{valeur}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Recherche({ valeurInitiale = "" }) {
  const [numero, setNumero] = useState(valeurInitiale);
  const navigate = useNavigate();

  function auEnvoi(e) {
    e.preventDefault();
    const propre = numero.trim();
    if (propre) navigate(`/tracking/${encodeURIComponent(propre)}`);
  }

  return (
    <form onSubmit={auEnvoi} className="relative w-full max-w-lg">
      <input
        type="text"
        aria-label="Numéro de suivi"
        placeholder="Entrez votre numéro de suivi"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        className="w-full border border-gray-300 rounded-lg h-12 px-4 pr-14 bg-white"
      />
      <button
        type="submit"
        aria-label="Suivre mon colis"
        className="absolute right-1 top-1 bg-orange-500 text-white rounded-lg p-2"
      >
        <ArrowUpRight />
      </button>
    </form>
  );
}

export default function Tracking() {
  const { trackingNumber } = useParams();
  const [colis, setColis] = useState(null);
  // const [itineraire, setItineraire] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [itineraire, setItineraire] = useState({
    depart: "",
    destination: "",
  });

  const charger = useCallback(async (numero) => {
    setChargement(true);
    setErreur(null);
    setColis(null);

    try {
      const donnees = await suivreColis(numero);
      setColis(donnees.colis);

      setItineraire({
        depart: donnees.colis.depart,
        destination: donnees.colis.destination,
      });
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    if (trackingNumber) charger(trackingNumber);
  }, [trackingNumber, charger]);

  const arrivee = colis ? arriveeAjustee(colis) : null;

  return (
    <div
      style={{ backgroundColor: "#f9f9fa" }}
      className="min-h-screen flex flex-col"
    >
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4">
          <Link to="/" className="flex gap-2 items-center w-fit">
            <Box className="text-orange-500" />
            <span className="text-xl font-bold">SwiftShipe</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-8 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Suivre mon colis</h1>
          <p className="text-gray-600">
            Votre numéro de suivi suffit : aucun compte, aucune inscription.
          </p>
          <Recherche valeurInitiale={trackingNumber ?? ""} />
        </div>

        {chargement && <p className="text-gray-500">Recherche en cours…</p>}

        {erreur && (
          <div
            role="alert"
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center space-y-3"
          >
            <PackageSearch className="size-10 mx-auto text-gray-400" />
            <p className="font-semibold text-lg">{erreur}</p>
            <p className="text-gray-600">
              Vérifiez le numéro communiqué par l'agence. Il se présente sous la
              forme{" "}
              <code className="font-semibold">SHT-000000000000-CARGO</code>.
            </p>
          </div>
        )}

        {colis && (
          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-gray-500 text-sm">Numéro de suivi</p>
                  <code className="text-lg font-bold tracking-wide break-all">
                    {colis.trackingNumber}
                  </code>
                </div>
                <span className="inline-block w-fit rounded-full px-4 py-2 bg-orange-100 text-orange-700 font-semibold">
                  {colis.libelle}
                </span>
              </div>

              <BarreProgression expedition={colis} />
              <MapItineraire
                depart={itineraire.depart}
                destination={itineraire.destination}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-2 font-semibold">
                  <Truck className="size-5 text-orange-500" />
                  {itineraire.depart || "Point de départ"}
                </span>
                <span className="text-gray-400">→</span>
                <span className="flex items-center gap-2 font-semibold">
                  <MapPin className="size-5 text-orange-500" />
                  {itineraire.destination || "Destination"}
                </span>
              </div>

              {arrivee && (
                <p className="text-gray-600">
                  Arrivée estimée :{" "}
                  <span className="font-semibold">{dateLongue(arrivee)}</span>
                  {colis.progression?.enPause && " (suspendue)"}
                </p>
              )}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4">Évolution</h2>
                <Timeline colis={colis} />
              </section>

              <div className="space-y-6">
                <Fiche
                  titre="Colis"
                  lignes={[
                    ["Type", LIBELLES_TYPE[colis.typeLivraison]],
                    ["Description", colis.colis?.description],
                    ["Taille", colis.colis?.taille],
                    [
                      "Poids",
                      colis.colis?.poids ? `${colis.colis.poids} kg` : null,
                    ],
                    [
                      "Distance",
                      colis.distanceKm ? `${colis.distanceKm} km` : null,
                    ],
                    ["Enregistré le", dateLongue(colis.creeLe)],
                  ]}
                />

                <Fiche
                  titre="Destinataire"
                  lignes={[
                    ["Nom", colis.destinataire?.nom],
                    ["Téléphone", colis.destinataire?.telephone],
                    ["Email", colis.destinataire?.email],
                    ["Adresse", colis.destinataire?.adresse],
                    ["Ville", colis.destinataire?.ville],
                  ]}
                />

                <Fiche
                  titre="Expediteur"
                  lignes={[
                    ["Nom", colis.expediteur?.nom],
                    ["Téléphone", colis.expediteur?.numero],
                    ["Email", colis.expediteur?.email],
                    ["adresse", colis.expediteur?.adresse],
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <WidgetChat />
    </div>
  );
}
