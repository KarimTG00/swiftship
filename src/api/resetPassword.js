import { appelApi } from "./client";

export default function reset(donnees) {
  return appelApi("/resetPassword/recuperation", {
    methode: "POST",
    corps: donnees,
  });
}
