import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, LoaderCircle } from "lucide-react";
import { useAuth } from "../contexts/contexteAuth";
import reset from "../api/resetPassword";

export default function Login() {
  const { utilisateur, chargement, connexion } = useAuth();
  const navigate = useNavigate();
  const emplacement = useLocation();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [resetPassword, setResetPassword] = useState({
    status: false,
    email: {},
  });

  const destination = emplacement.state?.depuis?.pathname ?? "/dashboard";

  // Un admin déjà connecté n'a rien à faire sur la page de connexion.
  useEffect(() => {
    if (!chargement && utilisateur) {
      navigate(destination, { replace: true });
    }
  }, [chargement, utilisateur, destination, navigate]);

  async function auEnvoi(e) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);

    try {
      await connexion(email, motDePasse);
      // Pas de navigate ici : l'effet ci-dessus s'en charge dès que
      // "utilisateur" est renseigné. Naviguer aux deux endroits déclenchait
      // deux redirections dans le même cycle de rendu.
      // On ne remet pas non plus "envoi" à false : le composant est démonté
      // par la redirection, et modifier son état après coup fait manipuler à
      // React des nœuds qui ne sont plus dans le document.
    } catch (e) {
      setErreur(e.message);
      setMotDePasse("");
      setEnvoi(false);
    }
  }

  return (
    <div
      style={{ backgroundColor: "#f9f9fa" }}
      className="min-h-screen flex flex-col animate-fade-in"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-4">
        <Link to="/" className="flex gap-2 items-center w-fit">
          <Box className="text-orange-500" />
          <span className="text-xl font-bold">SwiftShipe</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold">Espace agence</h1>
          <p className="text-gray-600 mt-2">
            Cette connexion est réservée aux membres de l'agence. Les clients
            n'ont pas besoin de compte pour suivre un colis.
          </p>

          <form onSubmit={auEnvoi} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="motDePasse" className="block font-semibold">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                type="password"
                required
                autoComplete="current-password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {erreur && (
              <p role="alert" className="text-red-600">
                {erreur}
              </p>
            )}

            <button
              type="submit"
              disabled={envoi}
              className="w-full bg-orange-500 text-white font-semibold rounded-full px-6 py-3 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {envoi && <LoaderCircle className="size-5 animate-spin" />}
              {envoi ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <Link
            to="/"
            className="block text-center text-gray-500 hover:text-gray-800 mt-6"
          >
            Retour au site
          </Link>
          <div className="pt-4 space-y-3">
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setResetPassword({ ...resetPassword, status: true });
              }}
            >
              Mot de passe oublier ?{" "}
            </span>

            {resetPassword.status && (
              <div className="space-y-3">
                <p className="block font-semibold text-gray-500">
                  Entrer l'email correspondant a se compte
                </p>
                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    reset(resetPassword.email);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="reset" className="font-semibold block">
                      Email :{" "}
                    </label>
                    <input
                      type="email"
                      required
                      name="email_reset"
                      id="reset"
                      onChange={(e) => {
                        setResetPassword({
                          ...resetPassword,
                          email: { email: e.target.value },
                        });
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 "
                    />

                    <button
                      type="submit"
                      className="w-full border-2 border-gray-200 bg-blue-400 text-white font-semibold rounded-full px-6 py-3 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {" "}
                      reset
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
