import { appelApi } from "./client";

export function creerExpedition(donnees) {
  return appelApi("/shipments", { methode: "POST", corps: donnees });
}

export function listerExpeditions({ q, statut } = {}) {
  const parametres = new URLSearchParams();
  if (q) parametres.set("q", q);
  if (statut) parametres.set("statut", statut);

  const suffixe = parametres.toString() ? `?${parametres}` : "";
  return appelApi(`/shipments${suffixe}`);
}

export function chargerExpedition(id) {
  return appelApi(`/shipments/${id}`);
}

export function changerProgression(id, action) {
  return appelApi(`/shipments/${id}/progression`, {
    methode: "PATCH",
    corps: { action },
  });
}
