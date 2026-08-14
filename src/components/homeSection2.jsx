import { Box, Plus } from "lucide-react";
import camion from "../assets/camion.jpg";

export default function Section2() {
  return (
    <div className="mt-5 mx-auto max-w-6xl px-5 md:px-8 space-y-10 overflow-x-hidden mb-12">
      <div className="text-orange-500 min-w-50 rounded-2xl p-1 bg-orange-400/20 flex w-fit border border-orange-500">
        <Box />
        <span className="px-2">Livraison rapide et fiable</span>
      </div>

      <div className="space-y-8 text-center border-b  border-gray-500 ">
        <div>
          <img
            src={camion}
            alt=""
            className="w-full h-56 md:h-80 lg:h-96 object-cover rounded-lg"
          />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          Votre agence de livraison de colis
        </h1>
        <p className="text-lg text-gray-600 my-8 max-w-3xl mx-auto">
          Quand vous attendez un colis, une seule question compte vraiment : où
          est-il, et quand arrive-t-il ? Nous prenons en charge vos colis de
          leur enregistrement jusqu'à leur remise au destinataire, et nous vous
          donnons les moyens de suivre chaque étape du trajet. Un numéro de
          suivi suffit : pas de compte à créer, pas de mot de passe à retenir.
          Et si une question se pose en cours de route, vous pouvez nous écrire
          directement depuis le site.
        </p>
      </div>
      <a href="#a-propos" className="flex items-center gap-6 w-fit group">
        <span className="bg-orange-500/90 w-fit rounded-full text-gray-100">
          <Plus className="size-12" />
        </span>
        <span className="text-2xl font-bold group-hover:underline">
          En savoir plus
        </span>
      </a>
    </div>
  );
}
