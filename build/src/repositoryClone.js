import { execa } from "execa";
import fs from "fs";
import { updateEnvVariable } from "./updateEnvVariable.js";
async function getRepositoryCommitHash(url) {
    try {
        const { stdout: remoteCommitHash } = await execa("git", ["ls-remote", url, "HEAD"]);
        return remoteCommitHash.split("\t")[0];
    }
    catch (e) {
        console.error("[Github Updater] Error getting remote commit hash: ", e);
        return "";
    }
}
;
export async function cloneRepository(url, path) {
    try {
        const currentCommitHash = process.env.CURRENT_COMMIT_HASH;
        const remoteCommitHash = await getRepositoryCommitHash(url);
        if (remoteCommitHash === currentCommitHash) {
            console.log("[Github Updater] The program has the latest version 👍.");
            return true;
        }
        if (fs.existsSync(path)) {
            console.log("[Github Updater] Repository exists, pulling latest changes...");
            await execa("git", ["-C", path, "pull"]);
            console.log("[Github Updater] ✅ Repository updated successfully!");
        }
        else {
            console.log("[Github Updater] Cloning repository...");
            await execa("git", ["clone", url, path]);
            console.log("[Github Updater] ✅ Repository cloned successfully!");
        }
        updateEnvVariable("CURRENT_COMMIT_HASH", remoteCommitHash);
        return true;
    }
    catch (error) {
        console.error("[Github Updater] Error cloning repository: ", error);
        return false;
    }
}
