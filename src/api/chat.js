import { appelApi } from "./client";

export function chargerConversation() {
  return appelApi("/chat/conversation");
}

export function envoyerMessage(corps) {
  return appelApi("/chat/messages", { methode: "POST", corps: { corps } });
}

export function enregistrerContact({ email, nom }) {
  return appelApi("/chat/contact", { methode: "POST", corps: { email, nom } });
}
