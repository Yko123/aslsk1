/**
 * Small wrapper over the browser's localStorage. What a visitor types stays in
 * their own browser; nothing is sent anywhere. Storage can be blocked (private
 * windows), so every call is wrapped and falls back quietly.
 */
import { project } from "../project.ts";

const prefix = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:`;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  } catch {
    // Storage is full or blocked: the page still works, it just won't remember.
  }
}
