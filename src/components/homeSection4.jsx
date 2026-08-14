import { House, Package, Truck, Zap } from "lucide-react";

const services = [
  {
    icon: Package,
    titre: "Livraison standard",
    texte:
      "Pour les colis qui ne nécessitent pas d'acheminement urgent, avec un suivi disponible à chaque étape.",
  },
  {
    icon: Zap,
    titre: "Livraison express",
    texte:
      "Pour les envois prioritaires : votre colis est traité en priorité et acheminé dans les meilleurs délais.",
  },
  {
    icon: Truck,
    titre: "Livraison inter-ville",
    texte:
      "Pour les expéditions d'une ville à une autre, prises en charge et suivies jusqu'à leur destination.",
  },
  {
    icon: House,
    titre: "Livraison à domicile",
    texte:
      "Le colis est remis directement à l'adresse du destinataire, sans déplacement de sa part.",
  },
];

export default function Section4() {
  return (
    <div
      id="services"
      className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 md:px-10 py-10 md:py-16 gap-10 md:gap-14"
    >
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <div key={service.titre} className="space-y-4">
            <Icon className="text-blue-500/60 size-14" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{service.titre}</h3>
              <p className="text-lg text-gray-500">{service.texte}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
