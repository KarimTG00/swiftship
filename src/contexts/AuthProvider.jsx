import { useCallback, useEffect, useMemo, useState } from "react";
import { appelApi } from "../api/client";
import { ContexteAuth } from "./contexteAuth";

export default function FournisseurAuth({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  // "chargement" évite de rediriger vers /login pendant qu'on vérifie encore
  // la session : sans lui, un admin déjà connecté serait éjecté à chaque
  // rechargement de page.
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let annule = false;

    appelApi("/auth/me")
      .then((donnees) => {
        if (!annule) setUtilisateur(donnees.utilisateur);
      })
      .catch(() => {
        if (!annule) setUtilisateur(null);
      })
      .finally(() => {
        if (!annule) setChargement(false);
      });

    return () => {
      annule = true;
    };
  }, []);

  const connexion = useCallback(async (email, motDePasse) => {
    const donnees = await appelApi("/auth/login", {
      methode: "POST",
      corps: { email, motDePasse },
    });
    setUtilisateur(donnees.utilisateur);
    return donnees.utilisateur;
  }, []);

  const deconnexion = useCallback(async () => {
    try {
      await appelApi("/auth/logout", { methode: "POST" });
    } finally {
      // Même si l'appel échoue, on considère l'utilisateur déconnecté côté
      // interface : le cookie est de toute façon inutilisable.
      setUtilisateur(null);
    }
  }, []);

  const valeur = useMemo(
    () => ({ utilisateur, chargement, connexion, deconnexion }),
    [utilisateur, chargement, connexion, deconnexion],
  );

  return (
    <ContexteAuth.Provider value={valeur}>{children}</ContexteAuth.Provider>
  );
}
