import image from "../assets/image.png";
import camion from "../assets/camion.jpg";
import entrepot from "../assets/entrepot.jpg";
import { useEffect, useState } from "react";

export default function Section7() {
  const [img, setImg] = useState(image);
  const tab = [
    {
      label: "Suivi en temps réel",
      text: "Chaque étape du parcours de votre colis est enregistrée et consultable immédiatement. Votre numéro de suivi suffit : aucun compte, aucun mot de passe.",
      img: camion,
    },
    {
      label: "Rapidité",
      text: "Livraison standard ou express : le mode d'acheminement est choisi avec l'expéditeur selon l'urgence réelle de l'envoi.",
      img: entrepot,
    },
    {
      label: "Fiabilité",
      text: "Vos colis sont enregistrés, identifiés par un numéro unique et pris en charge avec attention jusqu'à leur remise au destinataire.",
      img: image,
    },
    {
      label: "Transparence",
      text: "L'historique complet de l'expédition reste accessible, et vous pouvez nous écrire à tout moment depuis le site si une information manque.",
      img: camion,
    },
  ];
  const [active, setActive] = useState({
    cle: 0,
    img: image,
  });
  useEffect(() => {
    const images = [camion, image, entrepot];
    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % images.length;
      setImg(images[i]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="a-propos" className="mx-auto max-w-7xl px-6 md:px-10">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl pb-8 pt-15 text-blue-400 font-semibold">
            Pourquoi SwiftShipe ?{" "}
          </h2>
          <p className="text-center max-w-2xl text-xl text-gray-700">
            Attendre un colis sans savoir où il se trouve, c'est frustrant. Nous
            avons construit SwiftShipe autour de cette idée simple : la personne
            qui attend une livraison doit pouvoir obtenir une réponse en
            quelques secondes, sans créer de compte et sans appeler qui que ce
            soit. Le reste — enregistrement du colis, acheminement, remise au
            destinataire — c'est notre travail, et nous le rendons visible.
          </p>
        </div>

        <div className="py-10 w-full">
          <img
            src={img}
            alt=""
            className="w-full h-70 md:h-96 lg:h-120 object-cover rounded-lg"
          />
        </div>

        <div className="text-center">
          <button className="border border-black p-2 w-70 max-w-full rounded-4xl ">
            Apprendre encore plus
          </button>
        </div>

        {/* Menu des avantages */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center mt-10 border-b border-gray-500 pb-10 mb-5 gap-2 md:gap-10 my-8">
          {tab.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => setActive({ cle: idx, img: item.img })}
              className={`text-lg py-2 transition-colors duration-200 text-left w-fit ${
                active.cle === idx
                  ? "border-b-4 border-yellow-400 font-semibold"
                  : "border-b-4 border-transparent"
              }`}
              style={{ outline: "none", background: "none" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-12 justify-center text-center md:text-left border-b border-gray-500 pb-10 my-8 mb-0">
          <div className="m-4 md:m-0 flex w-full max-w-80 md:max-w-sm lg:max-w-md shrink-0">
            <img
              key={active.cle}
              src={active.img}
              alt=""
              className="w-full h-50 md:h-72 object-cover rounded-lg animate-slide-in"
            />
          </div>
          <div className="flex flex-col items-center md:items-start justify-center">
            <h3 className="text-2xl md:text-3xl font-bold">
              {tab[active.cle]?.label}
            </h3>
            <p className="max-w-xl text-xl text-gray-700 mt-4 ">
              {tab[active.cle]?.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
