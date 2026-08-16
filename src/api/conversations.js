import { appelApi } from "./client";

export function listerConversations() {
  return appelApi("/conversations");
}

export function chargerMessages(id) {
  return appelApi(`/conversations/${id}/messages`);
}
