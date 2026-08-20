export default function Itineraire({ itineraire }) {
  return (
    <div className="bg-gray-200 min-h-80 flex justify-center items-center">
      {itineraire.erreur && <h2>{itineraire.erreur}</h2>}
    </div>
  );
}
