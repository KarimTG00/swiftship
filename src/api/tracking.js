import { appelApi } from "./client";

export function suivreColis(numero) {
  return appelApi(`/tracking/${encodeURIComponent(numero)}`);
}
