import inquirer from "inquirer";
import { updateEnvVariable } from "./src/updateEnvVariable.js";
const choices = [
    "Run program",
    "Change repository URL with personal access token",
    "Exit"
];
const question = [
    {
        type: "list",
        name: "action",
        message: "Choose an option:",
        choices
    }
];
const questionChange = [
    {
        type: "input",
        name: "newRepoURl",
        message: "Place your new repository URL with personal access token:",
    }
];
(async () => {
    const { action } = await inquirer.prompt(question);
    switch (action) {
        case choices[1]:
            const { newRepoURl } = await inquirer.prompt(questionChange);
            updateEnvVariable("REPOSITORY_URL", newRepoURl);
            break;
    }
})();
