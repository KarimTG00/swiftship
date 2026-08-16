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
  PackageSearch,
  Quote,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import WidgetChat from "../components/WidgetChat";
import ContactModal from "../components/contactModal";
import entrepot from "../assets/LivraisonModifie.jpg";
import livreur from "../assets/livraison.jpg";
import colisCamion from "../assets/colisCamion.jpg";
import atelier from "../assets/entrepot.jpg";

// ---------------------------------------------------------------------------
// DONNÉES D'EXEMPLE — à remplacer par les informations réelles de l'agence.
// Tout le contenu de la page vient de cet objet : il n'y a rien à modifier
// ailleurs dans le fichier.
//
// Les chiffres ci-dessous (10 000 livraisons, 9 clients sur 10, 5 ans) sont
// des valeurs d'exemple. Ne les publie pas tels quels : la règle du projet
// interdit d'afficher des chiffres inventés.
// ---------------------------------------------------------------------------
const AGENCE = {
  nom: "SwiftShipe",
  creeeEn: "2021",
  slogan: "Votre colis, notre priorité.",

  evolution: {
    titre: "Notre monde évolue autour de vous",
    accroche: "Premier jour : 10 livraisons. Aujourd'hui : environ 10 000.",
    texte:
      "Depuis plus de 5 ans, nous innovons pour vous offrir toujours plus. Nous augmentons nos moyens de transport et développons notre réseau, simplifions la logistique, améliorons le suivi et la visibilité, et exploitons les données de chaque étape du transport pour optimiser votre expérience.",
  },

  excellence: {
    titre: "Offrir un service d'excellence à nos clients",
    texte:
      "Selon nos propres statistiques, près de 9 clients destinataires sur 10 sont satisfaits de leur livraison. Afin de répondre aux exigences des clients professionnels et particuliers, SwiftShipe a mis en place de nombreuses offres pour une livraison de colis sur-mesure. Ces solutions permettent de transporter et livrer tous types de marchandises dans des conditions optimales : livraison express, le jour même ou sur rendez-vous, à domicile ou en point de retrait, avec un suivi précis grâce à l'outil de tracking.",
    note: "Enquête de satisfaction envoyée à nos clients destinataires à la suite d'une livraison.",
  },

  innovation: {
    titre: "L'innovation, un enjeu majeur chez SwiftShipe",
    paragraphes: [
      "Afin de répondre à ses enjeux stratégiques et garantir un traitement efficace et rapide des colis, SwiftShipe a investi ces dernières années dans des machines performantes — trieuses, plateaux automatisés — et dans les nouvelles technologies : caméras de vidéo-tracking, lecteurs de codes-barres multi-faces.",
      "Nous optimisons également la relation client et les preuves de livraison grâce à des outils d'analyse automatisée.",
      "SwiftShipe innove aussi pour répondre aux enjeux des produits alimentaires et de santé thermosensibles, en développant un réseau de transport sous température dirigée et des hubs dédiés à ces activités.",
    ],
  },

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

  // TODO: remplacer par de vrais témoignages recueillis auprès de clients.
  temoignages: [
    {
      nom: "Amina K.",
      role: "Destinataire",
      note: 5,
      texte:
        "J'ai reçu le numéro de suivi par message et j'ai pu voir l'avancement sans créer de compte. C'est exactement ce que j'attendais.",
    },
    {
      nom: "Marc D.",
      role: "Expéditeur régulier",
      note: 5,
      texte:
        "J'envoie plusieurs colis par semaine. Un appel à l'agence suffit, et mes clients suivent leur livraison eux-mêmes. Ça m'a enlevé beaucoup d'appels.",
    },
    {
      nom: "Sofia B.",
      role: "Destinataire",
      note: 4,
      texte:
        "La barre de progression m'a évité de me demander toute la journée si le colis arrivait. J'ai su quand me rendre disponible.",
    },
    {
      nom: "Julien T.",
      role: "Commerçant",
      note: 5,
      texte:
        "Le contact est direct : j'écris depuis le site, on me répond. Pas de numéro surtaxé, pas de robot.",
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

// Petit intitulé au-dessus des titres : il donne un repère de lecture sans
// alourdir la hiérarchie des titres.
function Surtitre({ children }) {
  return (
    <p className="text-orange-500 font-semibold tracking-widest uppercase text-sm">
      {children}
    </p>
  );
}

function TitreSection({ children, centre = false }) {
  return (
    <h2
      className={`text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mt-3 ${
        centre ? "text-center" : ""
      }`}
    >
      {children}
    </h2>
  );
}

function Etoiles({ note }) {
  return (
    <div className="flex gap-1" aria-label={`Note : ${note} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`size-4 ${
            i <= note ? "fill-orange-400 text-orange-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function About() {
  const [contactOuvert, setContactOuvert] = useState(false);
  const { localisation, evolution, excellence, innovation } = AGENCE;

  return (
    <div style={{ backgroundColor: "#f9f9fa" }} className="min-h-screen">
      <Header />

      <div className="relative">
        <img
          src={entrepot}
          alt=""
          className="w-full h-80 sm:h-96 md:h-[30rem] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80" />
        <div className="absolute inset-0 flex items-center">
          <Section className="text-center">
            <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm">
              À propos
            </p>
            <h1 className="text-white font-bold text-3xl md:text-5xl lg:text-6xl mt-3 mx-auto max-w-3xl">
              {AGENCE.slogan}
            </h1>
            <p className="text-white/90 text-lg mt-5 flex items-center justify-center gap-2">
              <CalendarDays className="size-5 text-orange-400" />
              Agence créée en {AGENCE.creeeEn}
            </p>
          </Section>
        </div>
      </div>

      <main className="py-16 md:py-24 space-y-20 md:space-y-28">
        <Section>
          <div className="text-center mx-auto max-w-3xl">
            <Surtitre>Notre parcours</Surtitre>
            <TitreSection centre>{evolution.titre}</TitreSection>
            <p className="text-xl md:text-2xl font-semibold text-orange-500 mt-6">
              {evolution.accroche}
            </p>
            <p className="text-lg text-gray-600 mt-6">{evolution.texte}</p>
          </div>

          <div className="flex justify-center mt-10">
            <img
              src={livreur}
              alt=""
              className="w-full max-w-3xl h-64 md:h-96 object-cover rounded-2xl shadow-sm"
            />
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <img
              src={colisCamion}
              alt=""
              className="w-full h-64 md:h-96 object-cover rounded-2xl order-last lg:order-first"
            />
            <div>
              <Surtitre>Notre engagement</Surtitre>
              <TitreSection>{excellence.titre}</TitreSection>
              <p className="text-lg text-gray-600 mt-6">{excellence.texte}</p>
              <p className="text-sm text-gray-400 mt-4 border-l-2 border-gray-200 pl-3">
                {excellence.note}
              </p>
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <Surtitre>Technologie</Surtitre>
              <TitreSection>{innovation.titre}</TitreSection>
              <div className="space-y-4 mt-6">
                {innovation.paragraphes.map((p) => (
                  <p key={p.slice(0, 30)} className="text-lg text-gray-600">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <img
              src={atelier}
              alt=""
              className="w-full h-64 md:h-96 object-cover rounded-2xl"
            />
          </div>
        </Section>

        <div className="bg-blue-900 text-white py-16 md:py-24">
          <Section className="text-center">
            <Compass className="size-10 mx-auto text-orange-400" />
            <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mt-4">
              Notre vision
            </p>
            <p className="text-xl md:text-2xl mx-auto max-w-3xl mt-5">
              {AGENCE.vision}
            </p>
            <p className="text-white/70 mx-auto max-w-2xl italic mt-6">
              {AGENCE.mission}
            </p>
          </Section>
        </div>

        <Section>
          <div className="text-center">
            <Surtitre>Ce qui nous guide</Surtitre>
            <TitreSection centre>Nos valeurs</TitreSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {AGENCE.valeurs.map((valeur) => {
              const Icone = valeur.icone;
              return (
                <div
                  key={valeur.titre}
                  className="bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-3"
                >
                  <span className="inline-flex items-center justify-center size-14 rounded-full bg-orange-50">
                    <Icone className="text-orange-500 size-7" />
                  </span>
                  <h3 className="text-xl font-bold text-blue-900">
                    {valeur.titre}
                  </h3>
                  <p className="text-gray-600">{valeur.texte}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section>
          <div className="text-center">
            <Surtitre>Ils nous ont fait confiance</Surtitre>
            <TitreSection centre>
              Découvrez ce que les clients disent de SwiftShipe
            </TitreSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {AGENCE.temoignages.map((avis) => (
              <figure
                key={avis.nom}
                className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                <Quote className="size-8 text-orange-200" aria-hidden="true" />
                <blockquote className="text-lg text-gray-700 flex-1">
                  {avis.texte}
                </blockquote>
                <figcaption className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="font-bold text-blue-900">{avis.nom}</p>
                    <p className="text-gray-500 text-sm">{avis.role}</p>
                  </div>
                  <Etoiles note={avis.note} />
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section>
          <div className="text-center">
            <Surtitre>Nous trouver</Surtitre>
            <TitreSection centre>Où nous rendre visite</TitreSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
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

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
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
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-14 text-center space-y-6">
            <PackageSearch className="size-12 mx-auto text-orange-500" />
            <h2 className="text-2xl md:text-4xl font-bold text-blue-900">
              Suivez votre colis en temps réel
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Votre numéro de suivi suffit : aucun compte, aucune inscription.
              Pour expédier un colis, contactez directement l'agence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/tracking"
                className="bg-orange-500 text-white font-semibold rounded-full px-8 py-3"
              >
                Suivre mon colis
              </Link>
              <button
                type="button"
                onClick={() => setContactOuvert(true)}
                className="border border-gray-300 font-semibold rounded-full px-8 py-3 flex items-center justify-center gap-2"
              >
                <Building2 className="size-5" />
                Nous contacter
              </button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />

      <WidgetChat />

      {contactOuvert && <ContactModal onClose={() => setContactOuvert(false)} />}
    </div>
  );
}
