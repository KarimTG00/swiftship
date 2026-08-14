import hero from "../assets/hero.png";

export default function Section5() {
  return (
    <div id="zones" className="relative">
      <img src={hero} alt="" className="w-full h-72 md:h-100 object-cover" />
      <div className="bg-gray-900/60 absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 gap-3">
        <h3 className="text-white text-2xl md:text-4xl font-bold">
          Zones desservies
        </h3>
        {/* TODO: remplacer par la liste réelle des zones couvertes, fournie par
            l'agence. Ne jamais inventer de villes ou de régions. */}
        <p className="text-white/90 max-w-xl text-lg">
          Nous couvrons plusieurs zones de livraison. La liste détaillée est
          communiquée par l'agence.
        </p>
        <p className="text-white/70 max-w-xl">
          Votre zone n'apparaît pas ? Contactez-nous.
        </p>
      </div>
    </div>
  );
}
