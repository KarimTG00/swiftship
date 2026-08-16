import Footer from "../components/footer";
import WidgetChat from "../components/WidgetChat";
import Header from "../components/header";
import Section1 from "../components/homeSection1";
import Section2 from "../components/homeSection2";
import Section3 from "../components/homeSection3";
import Section4 from "../components/homeSection4";
import Section5 from "../components/section5";
import Section6 from "../components/section6";
import Section7 from "../components/section7";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const { hash } = useLocation();

  // Un lien vers une ancre de l'accueil ("/#zones") depuis une autre page :
  // React Router
  // ne fait pas défiler vers l'ancre tout seul.
  useEffect(() => {
    if (!hash) return;
    const cible = document.querySelector(hash);
    if (!cible) return;

    const mouvementReduit = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    cible.scrollIntoView({ behavior: mouvementReduit ? "auto" : "smooth" });
  }, [hash]);

  return (
    <div>
      <Header />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Footer />
      <WidgetChat />
    </div>
  );
}
