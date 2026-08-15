import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/contexteAuth";

export default function RouteProtegee({ children }) {
  const { utilisateur, chargement } = useAuth();
  const emplacement = useLocation();

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Vérification de la session…
      </div>
    );
  }

  if (!utilisateur) {
    // On mémorise la page demandée pour y revenir après la connexion.
    return <Navigate to="/login" state={{ depuis: emplacement }} replace />;
  }

  return children;
}
