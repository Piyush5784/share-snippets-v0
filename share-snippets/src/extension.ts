import * as vscode from "vscode";
import axios from "axios";

const BACKEND_URL = "https://www.share-snippets.site";

const name = "extension_share_snippets";

type snippet = {
  title: string;
  description: string;
  isPublic: boolean;
  language: string;
  code: string;
  tags: string[];
};

export async function activate(context: vscode.ExtensionContext) {
  try {
    const isFirstTime = !context.globalState.get(name);

    if (isFirstTime) {
      await context.globalState.update(name, true);
      await context.globalState.update("extensionInstalled", true);
    }

    const types = ["All snippets", "Private snippets"];

    const disposable = vscode.commands.registerCommand(
      "share-snippets.getSnippets",
      async () => {
        try {
          const snippetsType = await vscode.window.showQuickPick(types, {
            placeHolder: "Select snippets type",
          });

          if (!snippetsType) {
            return;
          }

          let token = await context.secrets.get("ApiKey");

          // If no token, login first
          if (!token) {
            const loginSuccess = await handleLogin(context);
            if (!loginSuccess) {
              return;
            }
            token = await context.secrets.get("ApiKey");
          }

          // Validate token before using
          const isValidToken = await validateApiKey(token!);
          if (!isValidToken) {
            await context.secrets.delete("ApiKey");
            vscode.window.showErrorMessage(
              "Invalid API key. Please login again."
            );
            const loginSuccess = await handleLogin(context);
            if (!loginSuccess) {
              return;
            }
            token = await context.secrets.get("ApiKey");
          }

          try {
            await fetchSnippet(snippetsType, token!, types);
          } catch (error: any) {
            console.error("Error fetching snippets:", error);

            if (
              error.response?.status === 401 ||
              error.response?.status === 403
            ) {
              await context.secrets.delete("ApiKey");
              vscode.window.showErrorMessage(
                "Authentication failed. Please login again."
              );
              const loginSuccess = await handleLogin(context);
              if (loginSuccess) {
                token = await context.secrets.get("ApiKey");
                try {
                  await fetchSnippet(snippetsType, token!, types);
                } catch (retryError) {
                  vscode.window.showErrorMessage(
                    "Failed to fetch snippets after login."
                  );
                }
              }
            } else {
              vscode.window.showErrorMessage(
                `Failed to fetch snippets: ${error.message || "Unknown error"}`
              );
            }
          }
        } catch (commandError: any) {
          console.error("Command execution error:", commandError);
          vscode.window.showErrorMessage(
            `Extension error: ${
              commandError.message || "Unknown error occurred"
            }`
          );
        }
      }
    );

    context.subscriptions.push(disposable);
  } catch (activationError: any) {
    console.error("Extension activation error:", activationError);
    vscode.window.showErrorMessage(
      `Failed to activate Share Snippets extension: ${
        activationError.message || "Unknown error"
      }`
    );
  }
}

async function validateApiKey(token: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/extension/validate-key`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000, // Increased timeout for production
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      }
    );

    return response.status === 200 && response.data?.success === true;
  } catch (error: any) {
    console.error("API key validation error:", error);

    // Handle specific error cases
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      vscode.window.showWarningMessage(
        "Network error: Unable to connect to Share Snippets server. Please check your internet connection."
      );
    } else if (error.code === "ETIMEDOUT") {
      vscode.window.showWarningMessage(
        "Request timeout: Share Snippets server is not responding. Please try again later."
      );
    }

    return false;
  }
}

async function fetchSnippet(
  snippetsType: string,
  token: string,
  types: string[]
) {
  try {
    const endpoint =
      snippetsType === types[0]
        ? `${BACKEND_URL}/api/extension/snippets`
        : `${BACKEND_URL}/api/extension/snippets/private`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: token,
      },
      timeout: 20000, // Increased timeout for fetching snippets
      validateStatus: (status) => status < 500, // Don't throw on 4xx errors
    });

    if (response.status !== 200) {
      throw new Error(
        `Server error: ${response.status} - ${response.statusText}`
      );
    }

    const snippets = (response.data?.data as snippet[]) || [];

    if (snippets.length === 0) {
      vscode.window.showInformationMessage(
        `No ${snippetsType.toLowerCase()} found.`
      );
      return;
    }

    const snippetPick = await vscode.window.showQuickPick(
      snippets.map((s) => ({
        label: s.title,
        description: s.description,
        detail: s.language ? `Language: ${s.language}` : undefined,
      })),
      {
        placeHolder: "Select a Snippet",
        matchOnDescription: true,
        matchOnDetail: true,
      }
    );

    if (!snippetPick) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active file open!");
      return;
    }

    const selectedSnippet = snippets.find((s) => s.title === snippetPick.label);
    if (selectedSnippet) {
      await editor.edit((edit: vscode.TextEditorEdit) => {
        const position = editor.selection.active;
        edit.insert(position, selectedSnippet.code);
      });
      vscode.window.showInformationMessage(
        `Snippet "${selectedSnippet.title}" inserted successfully!`
      );
    }
  } catch (error: any) {
    console.error("Fetch snippet error:", error);

    // Handle specific error cases
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error(
        "Network error: Unable to connect to Share Snippets server"
      );
    } else if (error.code === "ETIMEDOUT") {
      throw new Error(
        "Request timeout: Share Snippets server is not responding"
      );
    } else if (error.response?.status === 401) {
      throw new Error("Authentication failed: Invalid API key");
    } else if (error.response?.status === 403) {
      throw new Error("Access denied: Insufficient permissions");
    } else {
      throw new Error(
        `Failed to fetch snippets: ${error.message || "Unknown error"}`
      );
    }
  }
}

export async function handleLogin(
  context: vscode.ExtensionContext
): Promise<boolean> {
  return new Promise((resolve) => {
    const inputBox = vscode.window.createInputBox();
    inputBox.placeholder = "Enter your API key from share-snippets.site";
    inputBox.title = "Share Snippets Login";
    inputBox.show();

    inputBox.onDidAccept(async () => {
      const apiKey = inputBox.value.trim();
      inputBox.dispose();

      if (!apiKey) {
        vscode.window.showErrorMessage("API key cannot be empty");
        resolve(false);
        return;
      }

      // Show progress while validating
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Validating API key...",
          cancellable: false,
        },
        async () => {
          try {
            const isValid = await validateApiKey(apiKey);

            if (isValid) {
              await context.secrets.store("ApiKey", apiKey);
              vscode.window.showInformationMessage(
                "API key saved successfully!"
              );
              resolve(true);
            } else {
              vscode.window.showErrorMessage(
                "Invalid API key. Please check and try again."
              );
              resolve(false);
            }
          } catch (error: any) {
            vscode.window.showErrorMessage(
              `Error validating API key: ${error.message || "Network error"}`
            );
            resolve(false);
          }
        }
      );
    });

    inputBox.onDidHide(() => {
      inputBox.dispose();
      resolve(false);
    });
  });
}

// Add deactivate function for proper cleanup
export function deactivate() {
  // Extension cleanup when VS Code is shut down
  console.log("Share Snippets extension deactivated");
}
