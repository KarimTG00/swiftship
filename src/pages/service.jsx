import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Building2,
  Headset,
  MapPinned,
  PackageSearch,
  Plane,
  Ship,
  ShieldCheck,
  Train,
  Truck,
  Warehouse,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import WidgetChat from "../components/WidgetChat";
import ContactModal from "../components/contactModal";
import banniere from "../assets/colisCamion.jpg";
import aerien from "../assets/aerien.jpg";
import maritime from "../assets/maritime.jpg";
import routier from "../assets/routier.jpg";
import maritime2 from "../assets/maritime2.jpg";
import entreposage from "../assets/entreposage.jpg";
import distribution from "../assets/distribution.jpg";
import competences from "../assets/colis.jpg";

// import logo

import dhl from "../assets/partnerLogo/dhlLogo.png";
import fedex from "../assets/partnerLogo/fedexLogo.png";
import maersk from "../assets/partnerLogo/maerskLogo.png";
import msc from "../assets/partnerLogo/mscLogo.jpg";
import robinson from "../assets/partnerLogo/robinsonLogo.png";
import ups from "../assets/partnerLogo/upsLogo.png";

// ---------------------------------------------------------------------------
// DONNÉES D'EXEMPLE — tout le contenu de la page vient de cet objet.
//
// Les pourcentages de la section « Compétences » sont des valeurs d'exemple.
// Ne les publie pas tels quels : la règle du projet interdit d'afficher des
// chiffres inventés.
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    icone: Plane,
    image: aerien,
    titre: "Fret aérien",
    texte:
      "Services de fret aérien rapides et sécurisés pour les envois urgents.",
  },
  {
    icone: Ship,
    image: maritime,
    titre: "Fret maritime",
    texte:
      "Solutions de transport maritime économiques pour les conteneurs complets et les expéditions.",
  },
  {
    icone: Truck,
    image: routier,
    titre: "Transport routier",
    texte:
      "Solutions de transport routier porte-à-porte fiables pour les livraisons locales et transfrontalières.",
  },
  {
    icone: Train,
    image: maritime2,
    titre: "Fret ferroviaire",
    texte:
      "Transport ferroviaire efficace et durable pour le fret intérieur longue distance.",
  },
  {
    icone: Warehouse,
    image: entreposage,
    titre: "Entreposage",
    texte:
      "Entrepôts modernes et sécurisés avec gestion des stocks et stockage.",
  },
  {
    icone: Boxes,
    image: distribution,
    titre: "Distribution",
    texte:
      "Des services de distribution sans faille garantissant une livraison rapide depuis l'entrepôt.",
  },
];

const ATOUTS = [
  {
    icone: ShieldCheck,
    titre: "Sécurité du fret",
    texte:
      "Nos installations offrent des solutions de stockage sécurisées, évolutives et performantes, adaptées à vos besoins. Grâce à une surveillance continue et à des systèmes de gestion des stocks avancés, nous garantissons la sécurité et l'accessibilité de vos marchandises.",
  },
  {
    icone: MapPinned,
    titre: "Suivi en temps réel",
    texte:
      "Gardez le contrôle de vos expéditions grâce à notre système de suivi. Suivez la localisation et le statut exacts de vos marchandises à chaque étape, de l'enlèvement à la livraison.",
  },
  {
    icone: Warehouse,
    titre: "Entrepôt de stockage",
    texte:
      "Des solutions de stockage sécurisées et performantes pour votre entreprise. Contrôle climatique et systèmes d'inventaire avancés : vos marchandises restent en sécurité et facilement accessibles.",
  },
  {
    icone: Headset,
    titre: "Assistance prioritaire",
    texte:
      "Nous accordons la priorité à nos clients en leur fournissant une assistance dédiée, afin de garantir une expérience d'expédition fluide et sans stress.",
  },
];

// TODO: remplacer par des taux réels ou retirer la section.
const COMPETENCES = [
  { libelle: "Fret aérien", pourcentage: 98 },
  { libelle: "Fret maritime et océanique", pourcentage: 95 },
  { libelle: "Livraison routière et terrestre", pourcentage: 99 },
];

function Section({ children, className = "" }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 md:px-8 ${className}`}>
      {children}
    </section>
  );
}

function Surtitre({ children, centre = false }) {
  return (
    <p
      className={`text-orange-500 font-semibold tracking-widest uppercase text-sm ${
        centre ? "text-center" : ""
      }`}
    >
      {children}
    </p>
  );
}

function TitreSection({ children, centre = false }) {
  return (
    <h2
      className={`text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mt-3 ${
        centre ? "text-center" : ""
      }`}
    >
      {children}
    </h2>
  );
}

// Carte service : l'image occupe le haut, la carte bleue remonte par-dessus et
// déborde en bas. Le décalage se fait avec une marge négative plutôt qu'un
// positionnement absolu, pour que la hauteur reste calculée par le flux.
function CarteService({ service }) {
  const Icone = service.icone;
  return (
    <article className="flex flex-col">
      <img
        src={service.image}
        alt=""
        className="w-full h-72 md:h-80 object-cover rounded-xl"
      />
      <div className="relative -mt-24 mx-4 bg-blue-950 text-white rounded-xl p-6 text-center flex-1 flex flex-col gap-3 shadow-lg">
        <h3 className="flex items-center justify-center gap-2 text-lg font-bold">
          <Icone className="size-5 text-orange-400 shrink-0" />
          {service.titre}
        </h3>
        <p className="text-white/80">{service.texte}</p>
      </div>
    </article>
  );
}

export function Service() {
  const [contactOuvert, setContactOuvert] = useState(false);

  return (
    <div style={{ backgroundColor: "#f9f9fa" }} className="min-h-screen">
      <Header />

      <div className="relative">
        <img
          src={banniere}
          alt=""
          className="w-full h-56 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="absolute inset-0 flex items-center">
          <Section>
            <h1 className="text-white font-bold text-4xl md:text-6xl">
              Services
            </h1>
            <p className="text-white/80 mt-2">
              <Link to="/" className="hover:text-white">
                Accueil
              </Link>{" "}
              — Services
            </p>
          </Section>
        </div>
      </div>

      <main className="py-16 md:py-24 space-y-20 md:space-y-28">
        <Section>
          <Surtitre centre>Services</Surtitre>
          <TitreSection centre>Quels services proposons-nous ?</TitreSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {SERVICES.map((service) => (
              <CarteService key={service.titre} service={service} />
            ))}
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <Surtitre>Pourquoi nous choisir</Surtitre>
              <TitreSection>Livraisons ponctuelles et fiables</TitreSection>
              <p className="text-lg text-gray-600 mt-6">
                Nous mettons un point d'honneur à ce que chaque colis parvienne
                à destination rapidement et en toute sécurité. Notre engagement
                envers l'efficacité vous garantit des livraisons ponctuelles,
                qu'il s'agisse d'un envoi local ou d'une commande longue
                distance. Grâce à des systèmes de suivi performants et à une
                équipe logistique dédiée, nous vous assurons une expérience
                d'expédition sans accroc.
              </p>
            </div>

            {/* Colonne décalée d'une demi-carte à partir de md, comme sur la
                maquette : la deuxième colonne descend pour créer le décrochage. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ATOUTS.map((atout, index) => {
                const Icone = atout.icone;
                return (
                  <div
                    key={atout.titre}
                    className={`bg-white border border-gray-200 rounded-2xl p-6 text-center space-y-3 ${
                      index % 2 === 1 ? "sm:mt-10" : ""
                    }`}
                  >
                    <Icone className="size-8 mx-auto text-blue-950" />
                    <h3 className="text-xl font-bold text-blue-950">
                      {atout.titre}
                    </h3>
                    <p className="text-gray-600 text-sm">{atout.texte}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <Surtitre>Compétences</Surtitre>
              <TitreSection>
                Ce que nous faisons et comment nous le faisons
              </TitreSection>
              <p className="text-lg text-gray-600 mt-6">
                Nous investissons dans les bonnes personnes, les technologies
                adéquates et les infrastructures nécessaires pour fournir des
                services logistiques qui dépassent les attentes, qu'il s'agisse
                d'un simple colis ou d'un conteneur complet.
              </p>

              <div className="space-y-5 mt-8">
                {COMPETENCES.map((competence) => (
                  <div key={competence.libelle}>
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-medium text-blue-950">
                        {competence.libelle}
                      </span>
                      <span className="text-gray-500">
                        {competence.pourcentage} %
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={competence.pourcentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={competence.libelle}
                      className="h-2 w-full bg-gray-200 rounded-full mt-2 overflow-hidden"
                    >
                      <div
                        className="h-full bg-blue-950 rounded-full"
                        style={{ width: `${competence.pourcentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/tracking"
                className="inline-block bg-blue-950 text-white font-semibold rounded-lg px-6 py-3 mt-8"
              >
                Suivre l'expédition
              </Link>
            </div>

            <img
              src={competences}
              alt=""
              className="w-full h-72 md:h-96 lg:h-[26rem] object-cover rounded-2xl"
            />
          </div>
        </Section>

        <Section>
          <TitreSection centre>Nos entreprises partenaires</TitreSection>
          <p className="text-lg text-gray-600 mt-6 text-center mx-auto max-w-3xl">
            Nous sommes fiers de collaborer avec un réseau de partenaires
            logistiques qui partagent notre vision d'excellence et de fiabilité.
          </p>

          <ul className="flex gap-4 mt-12 w-full overflow-x-auto pb-2">
            <li className="shrink-0 w-36 sm:w-40 md:w-44 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center ">
              <img
                src={dhl}
                alt="DHL"
                className="w-full h-full object-cover rounded-xl"
              />
            </li>

            <li className="shrink-0 w-36 sm:w-40 md:w-44 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center px-4">
              <img
                src={fedex}
                alt="FedEx"
                className="w-full h-full object-contain"
              />
            </li>

            <li className="shrink-0 w-36 sm:w-40 md:w-44 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center px-4">
              <img
                src={maersk}
                alt="Maersk"
                className="w-full h-full object-contain"
              />
            </li>

            <li className="shrink-0 w-36 sm:w-40 md:w-44 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center px-4">
              <img
                src={msc}
                alt="MSC"
                className="w-full h-full object-contain"
              />
            </li>

            <li className="shrink-0 w-36 sm:w-40 md:w-44 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center px-4">
              <img
                src={robinson}
                alt="Robinson"
                className="w-full h-full object-contain"
              />
            </li>

            <li className="shrink-0 w-36 sm:w-40 md:w-44 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center px-4">
              <img
                src={ups}
                alt="UPS"
                className="w-full h-full object-contain"
              />
            </li>
          </ul>
        </Section>

        <Section>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-14 text-center space-y-6">
            <PackageSearch className="size-12 mx-auto text-orange-500" />
            <h2 className="text-2xl md:text-4xl font-bold text-blue-950">
              Un colis à suivre, un envoi à organiser ?
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

      {contactOuvert && (
        <ContactModal onClose={() => setContactOuvert(false)} />
      )}
    </div>
  );
}
