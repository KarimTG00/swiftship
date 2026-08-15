// En développement, Vite proxifie /api vers le port 4000 : la base est donc
// vide et les appels sont en same-origin. En production, VITE_API_URL pointe
// vers le sous-domaine de l'API.
const BASE = import.meta.env.VITE_API_URL ?? "";

export class ErreurApi extends Error {
  constructor(message, statut, champs) {
    super(message);
    this.name = "ErreurApi";
    this.statut = statut;
    // Détail des erreurs de validation, champ par champ, renvoyé par l'API
    // sur un 400. Permet d'afficher chaque message sous le bon input.
    this.champs = champs ?? null;
  }
}

export async function appelApi(chemin, { methode = "GET", corps } = {}) {
  let reponse;
  try {
    reponse = await fetch(`${BASE}/api${chemin}`, {
      method: methode,
      // Indispensable : sans credentials, le cookie de session n'est ni
      // envoyé ni enregistré, et l'utilisateur paraît déconnecté à chaque
      // rechargement.
      credentials: "include",
      headers: corps ? { "Content-Type": "application/json" } : undefined,
      body: corps ? JSON.stringify(corps) : undefined,
    });
  } catch {
    throw new ErreurApi("Serveur injoignable. Vérifie ta connexion.", 0);
  }

  const texte = await reponse.text();
  let donnees = null;
  if (texte) {
    try {
      donnees = JSON.parse(texte);
    } catch {
      donnees = null;
    }
  }

  if (!reponse.ok) {
    throw new ErreurApi(
      donnees?.erreur ?? "Une erreur inattendue est survenue.",
      reponse.status,
      donnees?.champs,
    );
  }

  return donnees;
}
