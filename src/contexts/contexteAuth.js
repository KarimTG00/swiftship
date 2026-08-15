import { createContext, useContext } from "react";

// Contexte et hook sont séparés du composant fournisseur : Fast Refresh de
// Vite ne fonctionne que si un fichier n'exporte que des composants.
export const ContexteAuth = createContext(null);

export function useAuth() {
  const contexte = useContext(ContexteAuth);
  if (!contexte) {
    throw new Error("useAuth doit être utilisé à l'intérieur de FournisseurAuth");
  }
  return contexte;
}
