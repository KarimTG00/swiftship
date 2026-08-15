// Miroir de src/domaine/progression.js côté API : le serveur ne stocke que des
// horodatages, et c'est le navigateur qui anime la barre. Aucune tâche de fond
// n'est donc nécessaire côté serveur, et la pause est exacte même si personne
// ne regarde la page.
//
// Tant que le colis n'est pas réellement livré, la barre est plafonnée :
// afficher 100 % sur un colis non livré est trompeur.
export const PLAFOND_AVANT_LIVRAISON = 0.9;

export function calculerRatio(expedition, maintenant = Date.now()) {
  if (expedition?.statut === "LIVREE") return 1;

  const p = expedition?.progression;
  if (!p?.demarreLe || !p?.arriveePrevueLe) return 0;

  const debut = new Date(p.demarreLe).getTime();
  const duree = new Date(p.arriveePrevueLe).getTime() - debut;
  if (duree <= 0) return PLAFOND_AVANT_LIVRAISON;

  // En pause, le temps se fige à l'instant de la mise en pause.
  const fin =
    p.enPause && p.pauseeLe ? new Date(p.pauseeLe).getTime() : maintenant;
  const ecoule = fin - debut - (p.cumulPauseMs ?? 0);

  return Math.min(PLAFOND_AVANT_LIVRAISON, Math.max(0, ecoule / duree));
}

// L'arrivée annoncée glisse de la durée totale des pauses.
export function arriveeAjustee(expedition, maintenant = Date.now()) {
  const p = expedition?.progression;
  if (!p?.arriveePrevueLe) return null;

  let decalage = p.cumulPauseMs ?? 0;
  if (p.enPause && p.pauseeLe) {
    decalage += maintenant - new Date(p.pauseeLe).getTime();
  }

  return new Date(new Date(p.arriveePrevueLe).getTime() + decalage);
}
