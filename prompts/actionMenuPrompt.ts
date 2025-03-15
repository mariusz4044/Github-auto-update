export const choices: string[] = [
    "Run program",
    "Change repository URL with personal access token",
    "Exit"
];

export const actionMenuPrompt: object[] = [
    {
        type: "list",
        name: "action",
        message: "Choose an option:",
        choices
    }
];
