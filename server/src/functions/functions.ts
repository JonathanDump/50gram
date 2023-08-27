require("dotenv").config();

export function envReader(variable: string): string {
  const result = process.env[variable];
  if (!result) {
    throw new Error("Can't find the env variable");
  }
  return result;
}
