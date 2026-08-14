import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// TODO: brancher sur l'API une fois le backend en place.
// Côté serveur, le message doit alimenter une conversation rattachée à
// l'anonymousClientId (cookie persistant), pas à l'email : l'email n'est qu'un
// moyen de rappel, il ne sert pas d'identité.
// En attendant, RIEN N'EST RÉELLEMENT ENVOYÉ.
async function envoyerMessage({ email, message }) {
  console.warn("Envoi simulé — aucun backend branché.", { email, message });
  await new Promise((resolve) => setTimeout(resolve, 600));
}

// La modale est montée uniquement quand elle est ouverte (voir les appelants) :
// chaque ouverture repart donc d'un formulaire vierge.
export default function ContactModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [etat, setEtat] = useState("saisie"); // saisie | envoi | envoye | erreur
  const champEmail = useRef(null);
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
    champEmail.current?.focus();

    return () => {
      document.removeEventListener("keydown", onTouche);
      document.body.style.overflow = overflowInitial;
    };
  }, []);

  async function auEnvoi(e) {
    e.preventDefault();
    setEtat("envoi");
    try {
      await envoyerMessage({ email, message });
      setEtat("envoye");
      setEmail("");
      setMessage("");
    } catch {
      setEtat("erreur");
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
        aria-labelledby="titre-contact"
        onClick={(e) => e.stopPropagation()}
        className="animate-rise-in bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-full overflow-y-auto"
      >
        <div className="flex justify-between items-start gap-4">
          <h2 id="titre-contact" className="text-2xl font-bold">
            Contactez-nous
          </h2>
          <button type="button" aria-label="Fermer" onClick={onClose}>
            <X className="size-6" />
          </button>
        </div>

        {etat === "envoye" ? (
          <div className="mt-6 space-y-4">
            <p className="text-lg">
              Merci, votre message a bien été pris en compte. Nous vous
              répondrons dès que possible.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-orange-500 text-white font-semibold rounded-full px-6 py-3"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={auEnvoi} className="mt-6 space-y-4">
            <p className="text-gray-600">
              Une question sur une livraison ? Écrivez-nous, nous vous répondons
              par email.
            </p>

            <div className="space-y-1">
              <label htmlFor="contact-email" className="block font-semibold">
                Votre email
              </label>
              <input
                ref={champEmail}
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-message" className="block font-semibold">
                Votre message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour, je voudrais savoir où en est mon colis…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-y"
              />
            </div>

            {etat === "erreur" && (
              <p className="text-red-600">
                L'envoi a échoué. Merci de réessayer dans un instant.
              </p>
            )}

            <button
              type="submit"
              disabled={etat === "envoi"}
              className="w-full bg-orange-500 text-white font-semibold rounded-full px-6 py-3 disabled:opacity-60"
            >
              {etat === "envoi" ? "Envoi en cours…" : "Envoyer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
