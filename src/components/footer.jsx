import { Box } from "lucide-react";
import { useState } from "react";
import ContactModal from "./contactModal";

// TODO: renseigner les coordonnées réelles de l'agence.
// Une valeur laissée vide n'est pas affichée : ne jamais inventer de numéro,
// d'adresse, d'email ou d'horaires.
const contact = [
  { label: "Téléphone", valeur: "" },
  { label: "WhatsApp", valeur: "" },
  { label: "Email", valeur: "" },
  { label: "Adresse", valeur: "" },
  { label: "Horaires", valeur: "" },
];

// TODO: remplacer par des routes (/services, /about, /faq) une fois les pages
// créées. Pour l'instant, seules les ancres de la page d'accueil existent :
// pas de lien mort.
const navigation = [
  { label: "Accueil", href: "#suivi" },
  { label: "Services", href: "#services" },
  { label: "Zones desservies", href: "#zones" },
  { label: "À propos", href: "#a-propos" },
  { label: "Suivi de colis", href: "#suivi" },
  { label: "FAQ", href: null },
  { label: "Contact", action: "contact" },
];

const services = [
  "Livraison standard",
  "Livraison express",
  "Livraison inter-ville",
  "Livraison à domicile",
];

const informations = [
  { label: "Conditions générales", href: null },
  { label: "Politique de confidentialité", href: null },
];

// TODO: n'ajouter ici que les réseaux sociaux réellement utilisés par l'agence.
const reseaux = [];

function Lien({ label, href, onClick }) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-gray-300 hover:text-white"
      >
        {label}
      </button>
    );
  }
  if (!href) {
    return <span className="text-gray-500">{label}</span>;
  }
  return (
    <a href={href} className="text-gray-300 hover:text-white">
      {label}
    </a>
  );
}

export default function Footer() {
  const [contactOuvert, setContactOuvert] = useState(false);
  const coordonnees = contact.filter((c) => c.valeur);

  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 md:px-8 py-14">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Box className="text-orange-500" />
            <span className="text-xl font-bold text-white">SwiftShipe</span>
          </div>
          <p className="text-gray-400">
            Suivez votre colis à chaque étape, sans compte et sans inscription.
          </p>
          <a
            href="#suivi"
            className="inline-block bg-orange-500 text-white rounded-full px-4 py-2 font-semibold"
          >
            Suivre mon colis
          </a>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg">Navigation</h3>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.label}>
                <Lien
                  {...item}
                  onClick={
                    item.action === "contact"
                      ? () => setContactOuvert(true)
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg">Services</h3>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service}>
                <a href="#services" className="text-gray-300 hover:text-white">
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg">Contact</h3>
          {coordonnees.length > 0 ? (
            <ul className="space-y-2">
              {coordonnees.map(({ label, valeur }) => (
                <li key={label}>
                  <span className="text-gray-500">{label} : </span>
                  <span className="text-gray-300">{valeur}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Coordonnées à renseigner.</p>
          )}

          <h3 className="text-white font-bold text-lg pt-4">Informations</h3>
          <ul className="space-y-2">
            {informations.map((item) => (
              <li key={item.label}>
                <Lien {...item} />
              </li>
            ))}
          </ul>

          {reseaux.length > 0 && (
            <ul className="flex gap-4 pt-4">
              {reseaux.map((reseau) => (
                <li key={reseau.label}>
                  <a
                    href={reseau.href}
                    className="text-gray-300 hover:text-white"
                  >
                    {reseau.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800 px-8 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} SwiftShipe. Tous droits réservés.
      </div>

      {contactOuvert && <ContactModal onClose={() => setContactOuvert(false)} />}
    </footer>
  );
}
