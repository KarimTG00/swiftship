import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, LogOut, PackagePlus, List } from "lucide-react";
import { useAuth } from "../contexts/contexteAuth";
import ModaleExpedition from "../components/ModaleExpedition";

// Les trois zones du dashboard arrivent aux étapes suivantes :
//   zone 1 — créer une expédition
//   zone 2 — conversations et chat avec les clients
//   zone 3 — voir les expéditions, avec pause / relance de la livraison
function ZoneAVenir({ titre, description }) {
  return (
    <section className="bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold">{titre}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
      <p className="text-gray-400 mt-4 text-sm">Pas encore disponible.</p>
    </section>
  );
}

export default function Dashboard() {
  const { utilisateur, deconnexion } = useAuth();
  const [sortie, setSortie] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);

  async function auClicDeconnexion() {
    setSortie(true);
    try {
      await deconnexion();
      // Pas de navigate : RouteProtegee renvoie automatiquement vers /login
      // dès que l'utilisateur passe à null. On ne remet pas "sortie" à false
      // non plus, le composant étant démonté par cette redirection.
    } catch {
      setSortie(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#f9f9fa" }} className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex justify-between items-center gap-4">
          <Link to="/" className="flex gap-2 items-center">
            <Box className="text-orange-500" />
            <span className="text-xl font-bold">SwiftShipe</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-gray-600">
              {utilisateur?.nom}
            </span>
            <button
              type="button"
              onClick={auClicDeconnexion}
              disabled={sortie}
              className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 disabled:opacity-60"
            >
              <LogOut className="size-4" />
              {sortie ? "Déconnexion…" : "Se déconnecter"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Connecté en tant que {utilisateur?.email} ({utilisateur?.role}).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setModaleOuverte(true)}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold rounded-full px-6 py-3"
          >
            <PackagePlus className="size-5" />
            Créer une nouvelle expédition
          </button>

          <Link
            to="/dashboard/expeditions"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 font-semibold rounded-full px-6 py-3"
          >
            <List className="size-5" />
            Voir les expéditions
          </Link>
        </div>

        <ZoneAVenir
          titre="Messages"
          description="Discuter en direct avec les clients qui suivent leur colis."
        />
      </main>

      {modaleOuverte && (
        <ModaleExpedition onClose={() => setModaleOuverte(false)} />
      )}
    </div>
  );
}
