import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  chargerConversation,
  enregistrerContact,
  envoyerMessage,
} from "../api/chat";

const ACCUEIL =
  "Bonjour. Une question sur votre colis ? Écrivez-nous, nous vous répondrons par email.";

// Mémorise que le visiteur a déjà ouvert la discussion, pour ne pas lui
// remettre la pastille « 1 message non lu » à chaque page.
// localStorage et non cookie : c'est une préférence d'affichage, pas une
// identité — l'identité reste le cookie httpOnly posé par le serveur.
const CLE_DEJA_OUVERT = "swiftshipe.chat-ouvert";

function dejaOuvertUneFois() {
  try {
    return localStorage.getItem(CLE_DEJA_OUVERT) === "1";
  } catch {
    return false; // navigation privée ou stockage refusé
  }
}

function memoriserOuverture() {
  try {
    localStorage.setItem(CLE_DEJA_OUVERT, "1");
  } catch {
    // Sans stockage, la pastille réapparaîtra : sans conséquence.
  }
}

function heure(valeur) {
  if (!valeur) return "";
  return new Date(valeur).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function jour(valeur) {
  const date = new Date(valeur);
  const aujourdhui = new Date();
  const hier = new Date(aujourdhui);
  hier.setDate(hier.getDate() - 1);

  const memeJour = (a, b) => a.toDateString() === b.toDateString();
  if (memeJour(date, aujourdhui)) return "Aujourd'hui";
  if (memeJour(date, hier)) return "Hier";
  return date.toLocaleDateString("fr-FR", { dateStyle: "long" });
}

function Bulle({ message }) {
  const duClient = message.auteurType === "CLIENT";

  return (
    <div className={`flex ${duClient ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          duClient
            ? "bg-orange-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.corps}</p>
        <p
          className={`text-xs mt-1 ${
            duClient ? "text-white/70" : "text-gray-400"
          }`}
        >
          {heure(message.envoyeLe)}
        </p>
      </div>
    </div>
  );
}

export default function WidgetChat() {
  const [ouvert, setOuvert] = useState(false);
  const [dejaVu, setDejaVu] = useState(dejaOuvertUneFois);
  const [messages, setMessages] = useState([]);
  const [emailRenseigne, setEmailRenseigne] = useState(true);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const [brouillon, setBrouillon] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [envoiContact, setEnvoiContact] = useState(false);

  const filRef = useRef(null);
  const champRef = useRef(null);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const donnees = await chargerConversation();
      setMessages(donnees.messages);
      setEmailRenseigne(donnees.emailRenseigne);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  }, []);

  // La conversation n'est chargée qu'à la première ouverture : inutile
  // d'appeler l'API — et de poser un cookie — pour un visiteur qui n'ouvrira
  // jamais le chat.
  useEffect(() => {
    if (ouvert) charger();
  }, [ouvert, charger]);

  // Le fil se replace en bas à chaque nouveau message.
  useEffect(() => {
    filRef.current?.scrollTo({ top: filRef.current.scrollHeight });
  }, [messages, emailRenseigne]);

  useEffect(() => {
    if (!ouvert) return;
    const onTouche = (e) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", onTouche);
    return () => document.removeEventListener("keydown", onTouche);
  }, [ouvert]);

  // Le formulaire de contact prend la main dès qu'un message est parti et que
  // l'email manque encore.
  const contactRequis = !emailRenseigne && messages.length > 0;

  async function auEnvoiMessage(e) {
    e.preventDefault();
    const corps = brouillon.trim();
    if (!corps || envoi) return;

    setEnvoi(true);
    setErreur(null);
    try {
      const donnees = await envoyerMessage(corps);
      setMessages((liste) => [...liste, donnees.message]);
      setEmailRenseigne(donnees.emailRenseigne);
      setBrouillon("");
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnvoi(false);
    }
  }

  async function auEnvoiContact(e) {
    e.preventDefault();
    setEnvoiContact(true);
    setErreur(null);
    try {
      await enregistrerContact({ email, nom });
      setEmailRenseigne(true);
      champRef.current?.focus();
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnvoiContact(false);
    }
  }

  function auClicOuverture() {
    setOuvert(true);
    setDejaVu(true);
    memoriserOuverture();
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={auClicOuverture}
        aria-label={
          dejaVu ? "Ouvrir la discussion" : "Ouvrir la discussion, 1 message non lu"
        }
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg px-5 py-4 transition-colors"
      >
        <MessageCircle className="size-6" />
        <span className="hidden sm:inline font-semibold">Nous écrire</span>

        {!dejaVu && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex items-center justify-center size-6 rounded-full bg-red-600 text-white text-sm font-bold border-2 border-white"
          >
            1
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Discussion avec l'agence"
      className="fixed bottom-5 right-5 left-5 sm:left-auto z-40 sm:w-96 max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-rise-in"
    >
      <div className="bg-blue-950 text-white px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-bold">Écrivez-nous</p>
          <p className="text-white/60 text-sm">Réponse par email</p>
        </div>
        <button
          type="button"
          onClick={() => setOuvert(false)}
          aria-label="Fermer la discussion"
          className="text-white/80 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>

      <div ref={filRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chargement && <p className="text-gray-400 text-center">Chargement…</p>}

        {!chargement && (
          <>
            {messages.length > 0 && (
              <p className="text-center text-gray-400 text-sm">
                {jour(messages[0].envoyeLe)}
              </p>
            )}

            <Bulle
              message={{ auteurType: "USER", corps: ACCUEIL, envoyeLe: null }}
            />

            {messages.map((message) => (
              <Bulle key={message.id} message={message} />
            ))}

            {contactRequis && (
              <div className="pt-2 space-y-3">
                <p className="text-center text-gray-500">
                  Merci. Indiquez votre adresse email pour que nous puissions
                  vous répondre.
                </p>

                <form
                  onSubmit={auEnvoiContact}
                  className="border-2 border-orange-500 rounded-xl p-3 space-y-3"
                >
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Votre nom"
                    aria-label="Votre nom"
                    className="w-full border-b border-gray-200 pb-2 outline-none"
                  />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email *"
                    aria-label="Votre email"
                    className="w-full border-b border-gray-200 pb-2 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={envoiContact}
                    className="w-full bg-orange-500 text-white font-semibold rounded-lg py-2 disabled:opacity-60"
                  >
                    {envoiContact ? "Envoi…" : "Valider"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {erreur && (
          <p role="alert" className="text-red-600 text-center">
            {erreur}
          </p>
        )}
      </div>

      <form
        onSubmit={auEnvoiMessage}
        className="border-t border-gray-200 p-3 flex items-center gap-2"
      >
        <input
          ref={champRef}
          type="text"
          value={brouillon}
          onChange={(e) => setBrouillon(e.target.value)}
          disabled={contactRequis}
          aria-label="Votre message"
          placeholder={
            contactRequis
              ? "Renseignez le formulaire ci-dessus"
              : "Écrivez votre message…"
          }
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={contactRequis || envoi || !brouillon.trim()}
          aria-label="Envoyer"
          className="bg-orange-500 text-white rounded-full p-2 disabled:opacity-40"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
}
