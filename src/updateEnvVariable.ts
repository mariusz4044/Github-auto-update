import fs from "fs";
import path from "path";

export function updateEnvVariable(key: string, value: string) {
  const envPath = path.resolve(process.cwd(), ".env");

  let env = fs.readFileSync(envPath, "utf-8");
  const regex = new RegExp(`^${key}=.*`, "m");
  if (regex.test(env)) {
    env = env.replace(regex, `${key}=${value}`);
  } else {
    env += `\n${key}=${value}`;
  }

  fs.writeFileSync(envPath, env);
}