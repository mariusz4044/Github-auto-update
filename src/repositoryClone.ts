import { execa } from "execa";
import fs from "fs/promises";
import path from "path";

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

async function isGitRepository(folderPath: string): Promise<boolean> {
  try {
    await fs.access(path.join(folderPath, ".git"));
    await execa("git", ["-C", folderPath, "status"]);
    return true;
  } catch {
    return false;
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

    const isGitRepoExist = await isGitRepository(path);

    if (isGitRepoExist) {
      console.log(
        "[Github Updater] 🚀 Repository exists, pulling latest changes...",
      );

      await execa("git", ["-C", path, "stash"]); //Remove local changes
      await execa("git", ["-C", path, "pull"]);
      console.log("[Github Updater] ✅  Project updated successfully!");
    } else {
      console.log("[Github Updater] 👇 Repository not found, cloning...");
      await execa("git", ["clone", url, path]);
      console.log("[Github Updater] ✅  Project cloned successfully!");
    }

    //  updateEnvVariable("CURRENT_COMMIT_HASH", remoteCommitHash);

    return true;
  } catch (error) {
    console.error("[Github Updater] Error cloning repository: ", error);
    return false;
  }
}
