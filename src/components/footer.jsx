import { Box, LogIn, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./contactModal";
import { useAuth } from "../contexts/contexteAuth";

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

// TODO: ajouter /faq une fois la page créée. Les entrées sans href sont
// rendues en texte grisé plutôt qu'en lien mort.
const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/service" },
  { label: "Zones desservies", href: "/#zones" },
  { label: "À propos", href: "/about" },
  { label: "Suivi de colis", href: "/tracking" },
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
  // Link plutôt que <a> : le footer est présent sur toutes les pages, et une
  // ancre brute ne mènerait nulle part ailleurs que sur l'accueil.
  return (
    <Link to={href} className="text-gray-300 hover:text-white">
      {label}
    </Link>
  );
}

export default function Footer() {
  const [contactOuvert, setContactOuvert] = useState(false);
  const { utilisateur } = useAuth();
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
          <Link
            to="/tracking"
            className="inline-block bg-orange-500 text-white rounded-full px-4 py-2 font-semibold"
          >
            Suivre mon colis
          </Link>
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
                <Link to="/service" className="text-gray-300 hover:text-white">
                  {service}
                </Link>
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

      <div className="border-t border-gray-800 px-6 md:px-8 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500">
          <span>© {new Date().getFullYear()} SwiftShipe. Tous droits réservés.</span>

          {/* Accès réservé aux membres de l'agence : discret, en pied de page,
              jamais mis en avant sur la partie vitrine (§13). */}
          {utilisateur ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 border border-gray-700 rounded-full px-4 py-2 text-gray-300 hover:text-white hover:border-gray-500"
            >
              <LayoutDashboard className="size-4" />
              Tableau de bord
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 border border-gray-700 rounded-full px-4 py-2 text-gray-300 hover:text-white hover:border-gray-500"
            >
              <LogIn className="size-4" />
              Se connecter
            </Link>
          )}
        </div>
      </div>

      {contactOuvert && <ContactModal onClose={() => setContactOuvert(false)} />}
    </footer>
  );
}
