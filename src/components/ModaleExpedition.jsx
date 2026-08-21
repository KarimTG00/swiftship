import { useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { creerExpedition } from "../api/expeditions";

const TYPES = [
  { valeur: "STANDARD", libelle: "Livraison standard" },
  { valeur: "EXPRESS", libelle: "Livraison express" },
  { valeur: "INTER_VILLE", libelle: "Livraison inter-ville" },
  { valeur: "DOMICILE", libelle: "Livraison à domicile" },
];

const VIDE = {
  nom: "",
  telephone: "",
  email: "",
  adresse: "",
  ville: "",
  destination: "",
  depart: "",
  description: "",
  taille: "",
  poids: "",

  nomExpediteur: "",
  emailExpediteur: "",
  adresseExpediteur: "",
  numeroExpediteur: "",

  valeur: "",
  typeLivraison: "STANDARD",
  arriveePrevueLe: "",
};

function Champ({ id, label, erreur, children, obligatoire }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-semibold text-sm">
        {label}
        {obligatoire && <span className="text-orange-500"> *</span>}
      </label>
      {children}
      {erreur && <p className="text-red-600 text-sm">{erreur}</p>}
    </div>
  );
}

// La modale est montée uniquement quand elle est ouverte : chaque ouverture
// repart donc d'un formulaire vierge.
export default function ModaleExpedition({ onClose, onCreee }) {
  const [valeurs, setValeurs] = useState(VIDE);
  const [erreurs, setErreurs] = useState({});
  const [erreurGlobale, setErreurGlobale] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [creee, setCreee] = useState(null);
  const [copie, setCopie] = useState(false);

  const premierChamp = useRef(null);
  const fermer = useRef(onClose);

  useEffect(() => {
    fermer.current = onClose;
  });

  useEffect(() => {
    const onTouche = (e) => {
      if (e.key === "Escape") fermer.current();
    };
    document.addEventListener("keydown", onTouche);

    const overflowInitial = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    premierChamp.current?.focus();

    return () => {
      document.removeEventListener("keydown", onTouche);
      document.body.style.overflow = overflowInitial;
    };
  }, []);

  function maj(champ, valeur) {
    setValeurs((v) => ({ ...v, [champ]: valeur }));
  }

  const classeChamp =
    "w-full border border-gray-300 rounded-lg px-3 py-2 bg-white";

  async function auEnvoi(e) {
    e.preventDefault();
    setErreurs({});
    setErreurGlobale(null);
    setEnvoi(true);

    try {
      const donnees = await creerExpedition({
        destinataire: {
          nom: valeurs.nom,
          telephone: valeurs.telephone,
          email: valeurs.email,
          adresse: valeurs.adresse,
          ville: valeurs.ville,
        },
        destination: valeurs.destination,
        depart: valeurs.depart,
        colis: {
          description: valeurs.description,
          taille: valeurs.taille,
          poids: valeurs.poids,
          valeur: valeurs.valeur,
        },
        expediteur: {
          nom: valeurs.nomExpediteur,
          email: valeurs.emailExpediteur,
          adresse: valeurs.adresseExpediteur,
          numero: valeurs.numeroExpediteur,
        },
        typeLivraison: valeurs.typeLivraison,
        arriveePrevueLe: valeurs.arriveePrevueLe
          ? new Date(valeurs.arriveePrevueLe).toISOString()
          : "",
      });

      setCreee(donnees.expedition);
      onCreee?.(donnees.expedition);
    } catch (e) {
      // L'API renvoie le détail par champ : on l'affiche sous le bon input.
      if (e.statut === 400 && e.champs) setErreurs(e.champs);
      setErreurGlobale(e.message);
    } finally {
      setEnvoi(false);
    }
  }

  async function copierTracking() {
    try {
      await navigator.clipboard.writeText(creee.trackingNumber);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      setCopie(false);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 animate-fade-in flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-expedition"
        onClick={(e) => e.stopPropagation()}
        className="animate-rise-in bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl p-6 max-h-full overflow-y-auto"
      >
        <div className="flex justify-between items-start gap-4">
          <h2 id="titre-expedition" className="text-2xl font-bold">
            {creee ? "Expédition créée" : "Nouvelle expédition"}
          </h2>
          <button type="button" aria-label="Fermer" onClick={onClose}>
            <X className="size-6" />
          </button>
        </div>

        {creee ? (
          <div className="mt-6 space-y-4">
            <p className="text-gray-600">
              Communiquez ce numéro au client : il lui suffit pour suivre son
              colis, sans compte ni inscription.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
              <code className="text-lg font-bold tracking-wide break-all">
                {creee.trackingNumber}
              </code>
              <button
                type="button"
                onClick={copierTracking}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shrink-0"
              >
                {copie ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copie ? "Copié" : "Copier"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreee(null);
                  setValeurs(VIDE);
                }}
                className="flex-1 border border-gray-300 font-semibold rounded-full px-6 py-3"
              >
                Créer une autre
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-orange-500 text-white font-semibold rounded-full px-6 py-3"
              >
                Terminer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={auEnvoi} className="mt-6 space-y-6">
            <fieldset className="space-y-4">
              <legend className="font-bold text-gray-800">Destinataire</legend>

              <Champ
                id="nom"
                label="Nom"
                obligatoire
                erreur={erreurs["destinataire.nom"]}
              >
                <input
                  ref={premierChamp}
                  id="nom"
                  required
                  value={valeurs.nom}
                  onChange={(e) => maj("nom", e.target.value)}
                  className={classeChamp}
                />
              </Champ>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Champ id="telephone" label="Téléphone">
                  <input
                    id="telephone"
                    value={valeurs.telephone}
                    onChange={(e) => maj("telephone", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
                <Champ id="ville" label="Ville">
                  <input
                    id="ville"
                    value={valeurs.ville}
                    onChange={(e) => maj("ville", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
              </div>

              <Champ id="email" label="Email">
                <input
                  id="email"
                  type="email"
                  value={valeurs.email}
                  onChange={(e) => maj("email", e.target.value)}
                  className={classeChamp}
                />
              </Champ>

              <Champ id="adresse" label="Adresse précise">
                <input
                  id="adresse"
                  value={valeurs.adresse}
                  onChange={(e) => maj("adresse", e.target.value)}
                  className={classeChamp}
                />
              </Champ>

              <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                Ces coordonnées sont affichées sur la page de suivi, qui est
                publique : toute personne disposant du numéro de suivi les voit.
              </p>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="font-bold text-gray-800">Expediteur</legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Champ
                  id="Nom"
                  label="Nom de l'expediteur"
                  obligatoire
                  erreur={erreurs.expediteur}
                >
                  <input
                    id="expediteur"
                    required
                    value={valeurs.nomExpediteur}
                    onChange={(e) => maj("nomExpediteur", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>

                <Champ id="emailExpediteur" label="email">
                  <input
                    id="emailExpediteur"
                    type="email"
                    required
                    value={valeurs.emailExpediteur}
                    onChange={(e) => maj("emailExpediteur", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
                <Champ id="adresseExpediteur" label="adresse">
                  <input
                    id="adresseExpediteur"
                    type="text"
                    required
                    value={valeurs.adresseExpediteur}
                    onChange={(e) => maj("adresseExpediteur", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
                <Champ id="numeroExpediteur" label="numéro">
                  <input
                    id="numeroExpediteur"
                    type="number"
                    value={valeurs.numeroExpediteur}
                    onChange={(e) => maj("numeroExpediteur", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
              </div>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="font-bold text-gray-800">Livraison</legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Champ
                  id="destination"
                  label="Destination (ville ou zone)"
                  obligatoire
                  erreur={erreurs.destination}
                >
                  <input
                    id="destination"
                    required
                    value={valeurs.destination}
                    onChange={(e) => maj("destination", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>

                <Champ id="depart" label="Départ">
                  <input
                    id="depart"
                    type="text"
                    min="0"
                    step="any"
                    value={valeurs.depart}
                    onChange={(e) => maj("depart", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Champ id="typeLivraison" label="Type de livraison">
                  <select
                    id="typeLivraison"
                    value={valeurs.typeLivraison}
                    onChange={(e) => maj("typeLivraison", e.target.value)}
                    className={classeChamp}
                  >
                    {TYPES.map((t) => (
                      <option key={t.valeur} value={t.valeur}>
                        {t.libelle}
                      </option>
                    ))}
                  </select>
                </Champ>

                <Champ
                  id="arriveePrevueLe"
                  label="Arrivée prévue"
                  obligatoire
                  erreur={erreurs.arriveePrevueLe}
                >
                  <input
                    id="arriveePrevueLe"
                    type="datetime-local"
                    required
                    value={valeurs.arriveePrevueLe}
                    onChange={(e) => maj("arriveePrevueLe", e.target.value)}
                    className={classeChamp}
                  />
                  <p className="text-gray-500 text-sm">
                    C'est cette date qui fait avancer la barre de progression du
                    client.
                  </p>
                </Champ>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="font-bold text-gray-800">Colis</legend>

              <Champ id="description" label="Description">
                <input
                  id="description"
                  value={valeurs.description}
                  onChange={(e) => maj("description", e.target.value)}
                  className={classeChamp}
                />
              </Champ>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Champ id="taille" label="Taille">
                  <input
                    id="taille"
                    value={valeurs.taille}
                    onChange={(e) => maj("taille", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
                <Champ id="poids" label="Poids (kg)">
                  <input
                    id="poids"
                    type="number"
                    min="0"
                    step="any"
                    value={valeurs.poids}
                    onChange={(e) => maj("poids", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
                <Champ id="valeur" label="Valeur">
                  <input
                    id="valeur"
                    type="number"
                    min="0"
                    step="any"
                    value={valeurs.valeur}
                    onChange={(e) => maj("valeur", e.target.value)}
                    className={classeChamp}
                  />
                </Champ>
              </div>
            </fieldset>

            {erreurGlobale && (
              <p role="alert" className="text-red-600">
                {erreurGlobale}
              </p>
            )}

            <button
              type="submit"
              disabled={envoi}
              className="w-full bg-orange-500 text-white font-semibold rounded-full px-6 py-3 disabled:opacity-60"
            >
              {envoi ? "Création…" : "Créer l'expédition"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
