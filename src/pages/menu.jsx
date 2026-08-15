import { Box, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ContactModal from "../components/contactModal";
import { useAuth } from "../contexts/contexteAuth";

// TODO: ajouter /faq ici une fois la page créée.
const liens = [
  { label: "Accueil", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "Zones desservies", to: "/#zones" },
  { label: "À propos", to: "/about" },
  { label: "Suivre un colis", to: "/tracking" },
];

export default function Menu() {
  const [contactOuvert, setContactOuvert] = useState(false);
  const { utilisateur } = useAuth();

  return (
    <div
      style={{ backgroundColor: "#f9f9fa" }}
      className="min-h-screen flex flex-col animate-fade-in"
    >
      <div className="mx-auto w-full max-w-7xl px-4 flex justify-between items-center py-4">
        <Link to="/" className="flex gap-2 items-center">
          <Box className="text-orange-500" />
          <span className="text-xl font-bold">SwiftShipe</span>
        </Link>
        <Link to="/" aria-label="Fermer le menu">
          <X className="size-7" />
        </Link>
      </div>

      <nav className="mx-auto w-full max-w-7xl px-4 flex-1 flex flex-col  pb-20">
        {liens.map((lien, idx) => (
          <Link
            key={lien.label}
            to={lien.to}
            style={{ animationDelay: `${0.15 + idx * 0.09}s` }}
            className="animate-rise-in text-xl font-semibold py-5 border-b border-gray-200"
          >
            {lien.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setContactOuvert(true)}
          style={{ animationDelay: `${0.15 + liens.length * 0.09}s` }}
          className="animate-rise-in text-xl font-semibold py-5 border-b border-gray-200 text-left"
        >
          Contactez-nous
        </button>
        <Link
          to={utilisateur ? "/dashboard" : "/login"}
          style={{ animationDelay: `${0.15 + (liens.length + 1) * 0.09}s` }}
          className="animate-rise-in text-xl font-semibold py-5 border-b border-gray-200"
        >
          {utilisateur ? "Tableau de bord" : "Se connecter"}
        </Link>
        <Link
          to="/#suivi"
          style={{ animationDelay: `${0.15 + (liens.length + 2) * 0.09}s` }}
          className="animate-rise-in mt-10 bg-orange-500 text-white text-xl font-semibold text-center rounded-full px-6 py-4"
        >
          Suivre mon colis
        </Link>
      </nav>

      {contactOuvert && <ContactModal onClose={() => setContactOuvert(false)} />}
    </div>
  );
}
