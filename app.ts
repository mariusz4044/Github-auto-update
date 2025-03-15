import inquirer from "inquirer";
import "dotenv/config";

import { updateEnvVariable } from "./src/updateEnvVariable.js";
import { cloneRepository } from "./src/repositoryClone.js";

//prompts
import { actionMenuPrompt, choices } from "./prompts/actionMenuPrompt.js";
import { changeRepoPrompt } from "./prompts/changeRepoPrompt.js";

//declare env variables
let REPOSITORY_URL: string = process.env.REPOSITORY_URL as string;
let CURRENT_COMMIT_HASH: string = process.env.CURRENT_COMMIT_HASH as string;

(async () => {
  const { action } = await inquirer.prompt(actionMenuPrompt as any);

  switch (action) {
    case choices[0]:
      await cloneRepository(REPOSITORY_URL, "./project");
      break;
    case choices[1]:
      const { newRepoURl } = await inquirer.prompt(changeRepoPrompt as any);
      if (!newRepoURl) return console.log("Please provide a valid URL");
      updateEnvVariable("REPOSITORY_URL", newRepoURl);
      REPOSITORY_URL = newRepoURl;
      break;
  }
})();
