import { Check, Circle, Dot } from "lucide-react";

// Toutes les étapes du parcours nominal. Celles qui n'ont pas encore eu lieu
// restent affichées en gris : le client voit ce qui reste à venir.
const ETAPES = [
  { statut: "ENREGISTREE", libelle: "Expédition enregistrée" },
  { statut: "EN_TRANSIT", libelle: "En transit" },
  { statut: "EN_LIVRAISON", libelle: "En cours de livraison" },
  { statut: "LIVREE", libelle: "Livrée" },
];

const HORS_PARCOURS = {
  ECHEC_LIVRAISON: "Échec de livraison",
  ANNULEE: "Expédition annulée",
};

function dateLongue(valeur) {
  if (!valeur) return null;
  return new Date(valeur).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function Timeline({ colis }) {
  const evenements = colis?.evenements ?? [];
  const parStatut = new Map(evenements.map((e) => [e.statut, e]));

  // Un échec ou une annulation sort du parcours nominal : on l'affiche à part
  // plutôt que de laisser croire que la livraison suit son cours.
  const incident = evenements.find((e) => HORS_PARCOURS[e.statut]);

  const indexActuel = ETAPES.findIndex((e) => e.statut === colis?.statut);

  return (
    <ol className="space-y-0">
      {ETAPES.map((etape, i) => {
        const evenement = parStatut.get(etape.statut);
        const atteinte = Boolean(evenement);
        const courante = i === indexActuel;
        const dernier = i === ETAPES.length - 1;

        return (
          <li key={etape.statut} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex items-center justify-center size-8 rounded-full shrink-0 ${
                  courante
                    ? "bg-orange-500 text-white"
                    : atteinte
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {courante ? (
                  <Dot className="size-6" />
                ) : atteinte ? (
                  <Check className="size-4" />
                ) : (
                  <Circle className="size-3" />
                )}
              </span>
              {!dernier && (
                <span
                  className={`w-0.5 flex-1 min-h-8 ${
                    atteinte ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            <div className={`pb-8 ${atteinte ? "" : "text-gray-400"}`}>
              <p className="font-semibold">{etape.libelle}</p>
              {evenement && (
                <p className="text-gray-500 text-sm">
                  {dateLongue(evenement.survenuLe)}
                </p>
              )}
            </div>
          </li>
        );
      })}

      {incident && (
        <li className="flex gap-4">
          <span className="flex items-center justify-center size-8 rounded-full bg-red-100 text-red-700 shrink-0">
            <Circle className="size-3" />
          </span>
          <div>
            <p className="font-semibold text-red-700">
              {HORS_PARCOURS[incident.statut]}
            </p>
            <p className="text-gray-500 text-sm">
              {dateLongue(incident.survenuLe)}
            </p>
          </div>
        </li>
      )}
    </ol>
  );
}
