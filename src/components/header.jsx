import { Box, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ContactModal from "./contactModal";
import { useAuth } from "../contexts/contexteAuth";

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
        {/* Les ancres sont préfixées par "/" : sur une autre page qu'accueil,
            un simple "#services" ne mènerait nulle part. */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link to="/service">Services</Link>
          <Link to="/#zones">Zones desservies</Link>
          <Link to="/about">À propos</Link>
          <button type="button" onClick={() => setContactOuvert(true)}>
            Contactez-nous
          </button>
          {utilisateur && (
            <Link to="/dashboard" className="font-semibold whitespace-nowrap">
              Dashboard
            </Link>
          )}
          <Link
            to="/tracking"
            className="bg-orange-500 text-white rounded-full px-4 py-2 font-semibold whitespace-nowrap"
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
