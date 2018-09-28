import config from "../config";

export function getVersion(): string {
  return config.app.version || "";
}
