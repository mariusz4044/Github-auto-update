export const choices = [
    "Run program",
    "Change repository URL with personal access token",
    "Exit"
];
export const actionMenuPrompt = [
    {
        type: "list",
        name: "action",
        message: "Choose an option:",
        choices
    }
];
