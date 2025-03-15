import { execa } from "execa";
export async function cloneRepository(url, path) {
    try {
        console.log("[Github Updater] Cloning repository...");
        await execa("git", ["clone", url, path]);
        console.log("[Github Updater] ✅ Repository cloned successfully!");
        return true;
    }
    catch (error) {
        console.error("[Github Updater] Error cloning repository: ", error);
        return false;
    }
    return true;
}
