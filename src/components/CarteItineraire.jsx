import { MapPin, Truck } from "lucide-react";

// La carte Google n'est affichée que si une clé est configurée. Sans clé, le
// composant retombe sur un itinéraire en texte : l'information reste lisible,
// et il suffira de renseigner VITE_GOOGLE_MAPS_KEY dans le .env pour que la
// carte apparaisse, sans toucher au code.
//
// La destination affichée est volontairement la ville ou la zone, jamais
// l'adresse exacte du destinataire : cette page est publique et le numéro de
// suivi n'authentifie personne (§37).
export default function CarteItineraire({ origine, destination }) {
  const cle = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const trajet = (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="flex items-center gap-2 font-semibold">
        <Truck className="size-5 text-orange-500" />
        {origine || "Point de départ"}
      </span>
      <span className="text-gray-400">→</span>
      <span className="flex items-center gap-2 font-semibold">
        <MapPin className="size-5 text-orange-500" />
        {destination || "Destination"}
      </span>
    </div>
  );

  if (!cle || !origine || !destination) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold">Itinéraire</h3>
        {trajet}
      </div>
    );
  }

  const src =
    "https://www.google.com/maps/embed/v1/directions" +
    `?key=${encodeURIComponent(cle)}` +
    `&origin=${encodeURIComponent(origine)}` +
    `&destination=${encodeURIComponent(destination)}` +
    "&mode=driving";

  return (
    <div className="space-y-3">
      <h3 className="font-bold">Itinéraire</h3>
      {trajet}
      <iframe
        title="Itinéraire de la livraison"
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-64 md:h-80 rounded-xl border border-gray-200"
      />
    </div>
  );
}
