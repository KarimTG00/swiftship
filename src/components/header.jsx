import { Box, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import ContactModal from "./contactModal";
import { useAuth } from "../contexts/contexteAuth";

const LIENS = [
  { label: "Accueil", to: "/" },
  { label: "Services", to: "/service" },
  { label: "À propos", to: "/about" },
];

// NavLink connaît la route courante : la page où l'on se trouve est soulignée
// en orange. Le soulignement est toujours présent, transparent quand le lien
// est inactif, pour que le texte ne se décale pas au changement de page.
function classeLien({ isActive }) {
  return `border-b-2 pb-1 transition-colors ${
    isActive
      ? "border-orange-500 text-orange-600 font-semibold"
      : "border-transparent hover:text-orange-600"
  }`;
}

export default function Header() {
  const [contactOuvert, setContactOuvert] = useState(false);
  const { utilisateur } = useAuth();

  return (
    <header style={{ backgroundColor: "#f9f9fa" }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex justify-between items-center py-4">
        <Link to="/" className="flex gap-2 items-center">
          <Box className="text-orange-500" />
          <span className="text-xl font-bold">SwiftShipe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {LIENS.map((lien) => (
            <NavLink
              key={lien.to}
              to={lien.to}
              // Sans "end", "/" serait considéré actif sur toutes les pages,
              // puisque toutes les routes commencent par "/".
              end={lien.to === "/"}
              className={classeLien}
            >
              {lien.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setContactOuvert(true)}
            className="border-b-2 border-transparent pb-1 hover:text-orange-600 transition-colors"
          >
            Contactez-nous
          </button>

          {utilisateur && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-semibold whitespace-nowrap border-b-2 pb-1 transition-colors ${
                  isActive
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent hover:text-orange-600"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          <Link
            to="/tracking"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 font-semibold whitespace-nowrap transition-colors"
          >
            Suivre mon colis
          </Link>
        </nav>

        <Link to="/menu" aria-label="Ouvrir le menu" className="md:hidden">
          <Menu className="size-6 duration-75" />
        </Link>
      </div>

      {contactOuvert && (
        <ContactModal onClose={() => setContactOuvert(false)} />
      )}
    </header>
  );
}
