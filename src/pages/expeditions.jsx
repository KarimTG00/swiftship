import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Box, Pause, Play, RefreshCw } from "lucide-react";
import { changerProgression, listerExpeditions } from "../api/expeditions";
import BarreProgression from "../components/BarreProgression";

const LIBELLES = {
  ENREGISTREE: "Enregistrée",
  EN_TRANSIT: "En transit",
  EN_LIVRAISON: "En cours de livraison",
  LIVREE: "Livrée",
  ECHEC_LIVRAISON: "Échec de livraison",
  ANNULEE: "Annulée",
};

const COULEURS = {
  ENREGISTREE: "bg-gray-100 text-gray-700",
  EN_TRANSIT: "bg-blue-100 text-blue-700",
  EN_LIVRAISON: "bg-amber-100 text-amber-700",
  LIVREE: "bg-green-100 text-green-700",
  ECHEC_LIVRAISON: "bg-red-100 text-red-700",
  ANNULEE: "bg-gray-200 text-gray-600",
};

function dateCourte(valeur) {
  if (!valeur) return "—";
  return new Date(valeur).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function Etiquette({ statut }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
        COULEURS[statut] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {LIBELLES[statut] ?? statut}
    </span>
  );
}

function Detail({ expedition, surChangement }) {
  const [action, setAction] = useState(false);
  const [erreur, setErreur] = useState(null);
  const enPause = Boolean(expedition.progression?.enPause);

  async function basculer() {
    setAction(true);
    setErreur(null);
    try {
      const donnees = await changerProgression(
        expedition._id,
        enPause ? "reprise" : "pause",
      );
      surChangement(donnees.expedition);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setAction(false);
    }
  }

  const lignes = [
    ["Destinataire", expedition.destinataire?.nom],
    ["Téléphone", expedition.destinataire?.telephone],
    ["Adresse", expedition.destinataire?.adresse],
    ["Ville", expedition.destinataire?.ville],
    ["Origine", expedition.origine],
    ["Destination", expedition.destination],
    ["Kilométrage", expedition.distanceKm ? `${expedition.distanceKm} km` : null],
    ["Description", expedition.colis?.description],
    ["Taille", expedition.colis?.taille],
    ["Poids", expedition.colis?.poids ? `${expedition.colis.poids} kg` : null],
    ["Valeur", expedition.colis?.valeur],
    ["Créée le", dateCourte(expedition.createdAt)],
    ["Arrivée prévue", dateCourte(expedition.progression?.arriveePrevueLe)],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "");

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4 md:p-6 space-y-6">
      <BarreProgression expedition={expedition} />

      <div>
        <button
          type="button"
          onClick={basculer}
          disabled={action}
          className="flex items-center gap-2 bg-orange-500 text-white font-semibold rounded-full px-5 py-2 disabled:opacity-60"
        >
          {enPause ? <Play className="size-4" /> : <Pause className="size-4" />}
          {enPause ? "Relancer la livraison" : "Mettre en pause"}
        </button>
        {erreur && (
          <p role="alert" className="text-red-600 mt-2">
            {erreur}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {lignes.map(([cle, valeur]) => (
          <div key={cle} className="flex justify-between gap-4 border-b border-gray-200 py-1">
            <dt className="text-gray-500">{cle}</dt>
            <dd className="text-right font-medium">{valeur}</dd>
          </div>
        ))}
      </dl>

      <div>
        <h3 className="font-bold mb-2">Historique</h3>
        <ul className="space-y-1">
          {(expedition.evenements ?? []).map((e, i) => (
            <li key={i} className="flex justify-between gap-4 text-sm">
              <span>{LIBELLES[e.statut] ?? e.statut}</span>
              <span className="text-gray-500">{dateCourte(e.survenuLe)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Expeditions() {
  const [expeditions, setExpeditions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [ouverte, setOuverte] = useState(null);
  const [recherche, setRecherche] = useState("");

  const charger = useCallback(async (q) => {
    setChargement(true);
    setErreur(null);
    try {
      const donnees = await listerExpeditions({ q });
      setExpeditions(donnees.expeditions);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  function remplacer(misAJour) {
    setExpeditions((liste) =>
      liste.map((e) => (e._id === misAJour._id ? misAJour : e)),
    );
  }

  return (
    <div style={{ backgroundColor: "#f9f9fa" }} className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex justify-between items-center gap-4">
          <Link to="/dashboard" className="flex gap-2 items-center">
            <ArrowLeft className="size-5" />
            <Box className="text-orange-500" />
            <span className="text-xl font-bold">Tableau de bord</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Expéditions</h1>
          <div className="flex gap-2">
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && charger(recherche)}
              placeholder="Rechercher un numéro de suivi"
              aria-label="Rechercher un numéro de suivi"
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white w-full sm:w-72"
            />
            <button
              type="button"
              onClick={() => charger(recherche)}
              aria-label="Actualiser"
              className="border border-gray-300 rounded-lg px-3 bg-white"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
        </div>

        {erreur && (
          <p role="alert" className="text-red-600">
            {erreur}
          </p>
        )}

        {chargement ? (
          <p className="text-gray-500">Chargement…</p>
        ) : expeditions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-600">
              {recherche
                ? "Aucune expédition ne correspond à ce numéro."
                : "Aucune expédition enregistrée pour le moment."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {expeditions.map((e) => {
              const estOuverte = ouverte === e._id;
              return (
                <li
                  key={e._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOuverte(estOuverte ? null : e._id)}
                    aria-expanded={estOuverte}
                    className="w-full text-left p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <code className="font-bold tracking-wide">
                        {e.trackingNumber}
                      </code>
                      <p className="text-gray-600">
                        {e.destinataire?.nom} — {e.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {e.progression?.enPause && (
                        <span className="text-gray-500 text-sm">En pause</span>
                      )}
                      <Etiquette statut={e.statut} />
                    </div>
                  </button>

                  {estOuverte && (
                    <Detail expedition={e} surChangement={remplacer} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
