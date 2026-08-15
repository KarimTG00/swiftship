import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Clock,
  Compass,
  Eye,
  Handshake,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import ContactModal from "../components/contactModal";
import entrepot from "../assets/entrepot.jpg";
import camion from "../assets/camion.jpg";

// ---------------------------------------------------------------------------
// DONNÉES D'EXEMPLE — à remplacer par les informations réelles de l'agence.
// Tout le contenu de la page vient de cet objet : il n'y a rien à modifier
// ailleurs dans le fichier.
//
// Rappel de la règle du projet : ne jamais publier de chiffres inventés
// (colis livrés, clients, taux de réussite). C'est pourquoi aucun compteur
// ne figure ici — ajoute-les seulement quand tu auras les vrais.
// ---------------------------------------------------------------------------
const AGENCE = {
  nom: "SwiftShipe",
  creeeEn: "2021",
  slogan: "Votre colis, notre priorité.",

  histoire: [
    "SwiftShipe est née d'un constat simple : quand on attend un colis, la question qui compte n'est pas de savoir comment il voyage, mais où il se trouve et quand il arrive. Trop souvent, la réponse demandait un appel, une attente, et parfois aucune certitude.",
    "L'agence a commencé avec une poignée de livraisons de proximité et un carnet papier. La demande a grandi, le carnet a montré ses limites, et l'idée d'un suivi accessible à tous s'est imposée d'elle-même.",
    "Aujourd'hui, chaque colis confié à l'agence reçoit un numéro de suivi unique. Un numéro suffit pour savoir où en est la livraison, sans compte à créer et sans mot de passe à retenir.",
  ],

  vision:
    "Rendre la livraison lisible. Nous voulons qu'une personne qui attend un colis obtienne une réponse en quelques secondes, à toute heure, sans avoir à appeler qui que ce soit. La technologie n'est pas là pour impressionner : elle est là pour supprimer l'inquiétude.",

  mission:
    "Prendre soin de ce qui nous est confié, et rendre son parcours visible du début à la fin.",

  valeurs: [
    {
      icone: Eye,
      titre: "Transparence",
      texte:
        "Chaque étape est enregistrée et consultable. Ce que nous savons, vous le savez.",
    },
    {
      icone: ShieldCheck,
      titre: "Fiabilité",
      texte:
        "Un colis identifié, tracé et remis en main propre au destinataire.",
    },
    {
      icone: Zap,
      titre: "Rapidité",
      texte:
        "Le mode d'acheminement est choisi selon l'urgence réelle de l'envoi.",
    },
    {
      icone: Handshake,
      titre: "Proximité",
      texte:
        "Une équipe joignable, qui répond aux questions plutôt que de renvoyer vers un formulaire.",
    },
  ],

  localisation: {
    adresse: "12 avenue des Expéditions",
    complement: "Bâtiment C — Zone logistique",
    codePostal: "00000",
    ville: "Ville à renseigner",
    horaires: [
      { jours: "Lundi – Vendredi", heures: "08h00 – 18h00" },
      { jours: "Samedi", heures: "09h00 – 13h00" },
      { jours: "Dimanche", heures: "Fermé" },
    ],
  },
};

function Section({ children, className = "" }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 md:px-8 ${className}`}>
      {children}
    </section>
  );
}

export default function About() {
  const [contactOuvert, setContactOuvert] = useState(false);
  const { localisation } = AGENCE;

  return (
    <div style={{ backgroundColor: "#f9f9fa" }} className="min-h-screen">
      <Header />

      <div className="relative">
        <img
          src={entrepot}
          alt=""
          className="w-full h-72 sm:h-96 object-cover"
        />
        <div className="bg-gray-900/60 absolute inset-0" />
        <div className="absolute inset-0 flex items-center">
          <Section>
            <p className="text-white/80 text-lg">À propos</p>
            <h1 className="text-white font-bold text-3xl md:text-5xl lg:text-6xl max-w-3xl">
              {AGENCE.slogan}
            </h1>
            <p className="text-white/90 text-lg mt-4 flex items-center gap-2">
              <CalendarDays className="size-5" />
              Agence créée en {AGENCE.creeeEn}
            </p>
          </Section>
        </div>
      </div>

      <main className="py-12 md:py-20 space-y-16 md:space-y-24">
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Notre histoire</h2>
              {AGENCE.histoire.map((paragraphe) => (
                <p key={paragraphe.slice(0, 30)} className="text-lg text-gray-600">
                  {paragraphe}
                </p>
              ))}
            </div>
            <img
              src={camion}
              alt=""
              className="w-full h-64 md:h-96 object-cover rounded-2xl"
            />
          </div>
        </Section>

        <div className="bg-black text-white py-12 md:py-20">
          <Section className="text-center space-y-5">
            <Compass className="size-10 mx-auto text-orange-400" />
            <h2 className="text-orange-400 text-2xl md:text-3xl lg:text-4xl font-bold">
              Notre vision
            </h2>
            <p className="text-lg mx-auto max-w-3xl">{AGENCE.vision}</p>
            <p className="text-white/70 mx-auto max-w-2xl italic">
              {AGENCE.mission}
            </p>
          </Section>
        </div>

        <Section>
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {AGENCE.valeurs.map((valeur) => {
              const Icone = valeur.icone;
              return (
                <div key={valeur.titre} className="space-y-3">
                  <Icone className="text-blue-500/60 size-12" />
                  <h3 className="text-xl font-bold">{valeur.titre}</h3>
                  <p className="text-gray-600">{valeur.texte}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section>
          <h2 className="text-3xl md:text-4xl font-bold">Où nous trouver</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="size-5 text-orange-500" />
                Adresse
              </h3>
              <address className="not-italic text-lg text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">{AGENCE.nom}</p>
                <p>{localisation.adresse}</p>
                <p>{localisation.complement}</p>
                <p>
                  {localisation.codePostal} {localisation.ville}
                </p>
              </address>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <Clock className="size-5 text-orange-500" />
                Horaires d'ouverture
              </h3>
              <dl className="space-y-2">
                {localisation.horaires.map((creneau) => (
                  <div
                    key={creneau.jours}
                    className="flex justify-between gap-4 border-b border-gray-100 py-1"
                  >
                    <dt className="text-gray-500">{creneau.jours}</dt>
                    <dd className="font-medium">{creneau.heures}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>

        <Section>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 text-center space-y-6">
            <Building2 className="size-10 mx-auto text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Un colis en route, ou un envoi à organiser ?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Le suivi se fait en ligne avec votre numéro. Pour expédier un
              colis, contactez directement l'agence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/tracking"
                className="bg-orange-500 text-white font-semibold rounded-full px-6 py-3"
              >
                Suivre mon colis
              </Link>
              <button
                type="button"
                onClick={() => setContactOuvert(true)}
                className="border border-gray-300 font-semibold rounded-full px-6 py-3"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />

      {contactOuvert && <ContactModal onClose={() => setContactOuvert(false)} />}
    </div>
  );
}
