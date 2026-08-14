import { useState, useEffect, useRef } from "react";

// ATTENTION : valeurs de démonstration.
// La spécification interdit d'afficher des chiffres inventés : ces quatre
// constantes doivent être remplacées par les données réelles de l'agence avant
// toute mise en ligne, sinon la section doit être retirée de la page d'accueil.
const COUNT_START = 13000;
const COUNT_END = 13635;
const PERCENT_START = 70;
const PERCENT_END = 93;

export default function Section6() {
  const [count, setCount] = useState(COUNT_START);
  const [countPercent, setCountPercent] = useState(PERCENT_START);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Les compteurs repartent de leur valeur de départ à chaque fois que la
    // section revient dans le viewport.
    let current = COUNT_START;
    let currentPercent = PERCENT_START;

    const interval = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= COUNT_END) clearInterval(interval);
    }, 1);

    const intervalPercent = setInterval(() => {
      currentPercent += 1;
      setCountPercent(currentPercent);
      if (currentPercent >= PERCENT_END) clearInterval(intervalPercent);
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(intervalPercent);
    };
  }, [isVisible]);

  return (
    <div
      ref={sectionRef}
      className="bg-blue-500 flex flex-col md:flex-row md:justify-center items-center gap-12 md:gap-24 lg:gap-40 mt-10 px-6 py-12 md:py-16"
    >
      <div className="flex flex-col items-center">
        <h3 className="text-white/90">Taux de livraison réussie</h3>
        <span className="text-5xl text-white font-bold">{countPercent}%</span>
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-white/90">Colis livrés</h3>
        <span className="text-5xl text-white font-bold">{count}</span>
      </div>
    </div>
  );
}
