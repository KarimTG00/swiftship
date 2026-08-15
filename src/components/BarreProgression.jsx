import { useEffect, useState } from "react";
import { calculerRatio } from "../domaine/progression";

export default function BarreProgression({ expedition }) {
  // Le ratio n'est pas stocké : il se déduit des dates et de l'heure courante.
  // Ce compteur ne sert qu'à provoquer un nouveau rendu chaque seconde.
  const [, setBattement] = useState(0);

  const enPause = Boolean(expedition?.progression?.enPause);
  // Inutile de compter les secondes quand la valeur est figée par définition.
  const fige = enPause || expedition?.statut === "LIVREE";

  useEffect(() => {
    if (fige) return;
    const intervalle = setInterval(() => setBattement((b) => b + 1), 1000);
    return () => clearInterval(intervalle);
  }, [fige]);

  const pourcentage = Math.round(calculerRatio(expedition) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold">Progression de la livraison</span>
        <span className="text-gray-600">{pourcentage} %</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={pourcentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-3 w-full bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
            enPause ? "bg-gray-400" : "bg-orange-500"
          }`}
          style={{ width: `${pourcentage}%` }}
        />
      </div>

      {enPause && (
        <p className="text-gray-600 text-sm">
          Livraison momentanément suspendue.
        </p>
      )}
    </div>
  );
}
