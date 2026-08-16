import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, RefreshCw, User } from "lucide-react";
import { chargerMessages, listerConversations } from "../api/conversations";

const RAFRAICHISSEMENT_MS = 30_000;

function dateCourte(valeur) {
  if (!valeur) return "—";
  return new Date(valeur).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function dateLongue(valeur) {
  if (!valeur) return "—";
  return new Date(valeur).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function Identite({ client, compact = false }) {
  if (!client?.identifie) {
    // Cas normal tant que le visiteur n'a pas rempli le formulaire de contact.
    return (
      <span className={compact ? "font-semibold" : "font-bold text-lg"}>
        Client non identifié
      </span>
    );
  }

  return (
    <span className={compact ? "font-semibold" : "font-bold text-lg"}>
      {client.nom || client.email}
    </span>
  );
}

export default function ZoneMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectionnee, setSelectionnee] = useState(null);
  const [fil, setFil] = useState(null);
  const [chargementListe, setChargementListe] = useState(true);
  const [chargementFil, setChargementFil] = useState(false);
  const [erreur, setErreur] = useState(null);

  const filRef = useRef(null);

  const chargerListe = useCallback(async () => {
    try {
      const donnees = await listerConversations();
      setConversations(donnees.conversations);
      setErreur(null);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargementListe(false);
    }
  }, []);

  useEffect(() => {
    chargerListe();
    // Rafraîchissement discret : seule la liste est rechargée, pour ne pas
    // interrompre la lecture d'un fil ouvert.
    const intervalle = setInterval(chargerListe, RAFRAICHISSEMENT_MS);
    return () => clearInterval(intervalle);
  }, [chargerListe]);

  const ouvrir = useCallback(
    async (id) => {
      setSelectionnee(id);
      setChargementFil(true);
      setFil(null);
      try {
        const donnees = await chargerMessages(id);
        setFil(donnees);
        // L'ouverture vaut lecture côté serveur : on remet le compteur à zéro
        // localement plutôt que de recharger toute la liste.
        setConversations((liste) =>
          liste.map((c) => (c.id === id ? { ...c, nonLus: 0 } : c)),
        );
      } catch (e) {
        setErreur(e.message);
      } finally {
        setChargementFil(false);
      }
    },
    [],
  );

  useEffect(() => {
    filRef.current?.scrollTo({ top: filRef.current.scrollHeight });
  }, [fil]);

  const totalNonLus = conversations.reduce((n, c) => n + (c.nonLus ?? 0), 0);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center gap-4 p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="size-5 text-orange-500" />
          Messages
          {totalNonLus > 0 && (
            <span className="bg-red-600 text-white text-sm rounded-full px-2 py-0.5">
              {totalNonLus}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={chargerListe}
          aria-label="Actualiser les messages"
          className="border border-gray-300 rounded-lg p-2"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      {erreur && (
        <p role="alert" className="text-red-600 p-6">
          {erreur}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] min-h-80">
        <ul className="border-b lg:border-b-0 lg:border-r border-gray-200 divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {chargementListe && (
            <li className="p-6 text-gray-500">Chargement…</li>
          )}

          {!chargementListe && conversations.length === 0 && (
            <li className="p-6 text-gray-500">
              Aucun message reçu pour le moment.
            </li>
          )}

          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => ouvrir(conversation.id)}
                aria-current={selectionnee === conversation.id}
                className={`w-full text-left p-4 space-y-1 ${
                  selectionnee === conversation.id
                    ? "bg-orange-50 border-l-4 border-orange-500"
                    : "border-l-4 border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <Identite client={conversation.client} compact />
                  {conversation.nonLus > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                      {conversation.nonLus}
                    </span>
                  )}
                </div>

                {conversation.client.identifie && conversation.client.nom && (
                  <p className="text-gray-500 text-sm truncate">
                    {conversation.client.email}
                  </p>
                )}

                <p className="text-gray-600 text-sm line-clamp-2">
                  {conversation.dernierMessage?.corps ?? "—"}
                </p>
                <p className="text-gray-400 text-xs">
                  {dateCourte(conversation.dernierMessageLe)}
                </p>
              </button>
            </li>
          ))}
        </ul>

        <div className="p-6">
          {!selectionnee && (
            <p className="text-gray-500">
              Sélectionnez une conversation pour lire les messages.
            </p>
          )}

          {chargementFil && <p className="text-gray-500">Chargement…</p>}

          {fil && !chargementFil && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Identite client={fil.conversation.client} />

                <dl className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 flex items-center gap-1 shrink-0">
                      <User className="size-4" />
                      Nom
                    </dt>
                    <dd className="font-medium">
                      {fil.conversation.client.nom || "Non renseigné"}
                    </dd>
                  </div>

                  <div className="flex gap-2">
                    <dt className="text-gray-500 flex items-center gap-1 shrink-0">
                      <Mail className="size-4" />
                      Email
                    </dt>
                    <dd className="font-medium break-all">
                      {fil.conversation.client.email ? (
                        // Ouvre le logiciel de messagerie : c'est par là que
                        // l'agence répond, l'application n'envoie rien.
                        <a
                          href={`mailto:${fil.conversation.client.email}`}
                          className="text-orange-600 hover:underline"
                        >
                          {fil.conversation.client.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">Non renseigné</span>
                      )}
                    </dd>
                  </div>

                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">Première visite</dt>
                    <dd className="font-medium">
                      {dateCourte(fil.conversation.client.premiereVisite)}
                    </dd>
                  </div>
                </dl>

                {fil.conversation.client.email && (
                  <a
                    href={`mailto:${fil.conversation.client.email}`}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold rounded-full px-5 py-2 mt-2"
                  >
                    <Mail className="size-4" />
                    Répondre par email
                  </a>
                )}
              </div>

              <div
                ref={filRef}
                className="border-t border-gray-200 pt-4 space-y-3 max-h-80 overflow-y-auto"
              >
                {fil.messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <p className="text-gray-400 text-xs">
                      {message.auteurType === "CLIENT" ? "Client" : "Agence"} —{" "}
                      {dateLongue(message.envoyeLe)}
                    </p>
                    <p className="bg-gray-50 border border-gray-200 rounded-xl p-3 whitespace-pre-wrap break-words">
                      {message.corps}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
