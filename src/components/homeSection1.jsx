import { ArrowUpRight } from "lucide-react";
import ImgEntrepot from "../assets/entrepot.jpg";

export default function Section1() {
  return (
    <div id="suivi" className="border-black">
      <div className="relative">
        <img
          src={ImgEntrepot}
          alt=""
          className="w-full h-100 sm:h-125 md:h-150 object-cover"
        />
        <div className="bg-gray-900/50 absolute inset-0"></div>
        <div className="absolute inset-0 overflow-hidden flex flex-col justify-end pb-12 md:pb-20">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-8 space-y-4">
            <div className="w-fit rounded-3xl animate-slide-in border-white border px-3 p-1 text-white text-base md:text-lg">
              <span className="mx-2">Livraison et suivi de colis</span>
            </div>
            <h1 className="animate-slide-in max-w-md md:max-w-2xl text-white font-bold text-3xl md:text-5xl lg:text-6xl">
              Votre colis, notre priorité.
            </h1>
            <p className="animate-slide-in max-w-md md:max-w-xl text-white text-base md:text-xl">
              Suivez votre colis à chaque étape, sans compte et sans
              inscription.
            </p>
            <div className="relative bg-gray-300/40 w-full max-w-md flex items-center rounded-lg h-12 mt-8 md:mt-10 animate-slide-up">
              <input
                type="text"
                aria-label="Numéro de suivi"
                className="border-white w-full h-full text-white placeholder:text-white/80 px-3 pr-12"
                placeholder="Entrez votre numéro de suivi"
              />
              <button
                type="button"
                aria-label="Suivre mon colis"
                className="absolute right-1 bg-white rounded-xl p-1"
              >
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
