import { execa } from "execa";
import fs from "fs/promises";

import { updateEnvVariable } from "./updateEnvVariable.js";

async function getRepositoryCommitHash(url: string): Promise<string> {
  try {
    const { stdout: remoteCommitHash } = await execa("git", [
      "ls-remote",
      url,
      "HEAD",
    ]);
    return remoteCommitHash.split("\t")[0];
  } catch (e) {
    console.error("[Github Updater] Error getting remote commit hash: ", e);
    return "";
  }
}

export async function cloneRepository(
  url: string,
  path: string,
): Promise<boolean> {
  try {
    const currentCommitHash = process.env.CURRENT_COMMIT_HASH;
    const remoteCommitHash = await getRepositoryCommitHash(url);

    if (remoteCommitHash === currentCommitHash) {
      console.log("[Github Updater] The program has the latest version 👍.");
      return true;
    }

    //remove old project
    await fs.rm(path, { recursive: true, force: true });

    console.log("[Github Updater] 🕒 Detect update, please wait");
    await execa("git", ["clone", url, path]);
    console.log("[Github Updater] ✅ Project updated successfully!");

    updateEnvVariable("CURRENT_COMMIT_HASH", remoteCommitHash);

    return true;
  } catch (error) {
    console.error("[Github Updater] Error cloning repository: ", error);
    return false;
  }
}
