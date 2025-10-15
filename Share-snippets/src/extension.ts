import * as vscode from "vscode";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000";
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
  const isFirstTime = !context.globalState.get(name);
  await context.secrets.delete("ApiKey");
  if (isFirstTime) {
    await context.globalState.update("extensionInstalled", true);
  }

  if (!isFirstTime) {
    await context.secrets.delete("ApiKey");
  }

  const types = ["All snippets", "Private snippets"];

  const disposable = vscode.commands.registerCommand(
    "get-snippets",
    async () => {
      const snippetsType = await vscode.window.showQuickPick(types, {
        placeHolder: "Select snippets type",
      });

      if (!snippetsType) {
        return;
      }

      let token = await context.secrets.get("ApiKey");

      if (!token) {
        await handleLogin(context);
      }

      token = await context.secrets.get("ApiKey");

      try {
        await fetchSnippet(snippetsType, token!, types);
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await context.secrets.delete("ApiKey");
          vscode.window.showErrorMessage(
            "Invalid API key. Please login again."
          );
          await handleLogin(context);
        } else {
          vscode.window.showErrorMessage("Failed to fetch snippets.");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function validateApiKey(token: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/extension/validate-key`,
      {
        headers: { Authorization: token },
      }
    );

    console.log({ response });
    return response.data.success;
  } catch (error) {
    return false;
  }
}

async function fetchSnippet(
  snippetsType: string,
  token: string,
  types: string[]
) {
  const endpoint =
    snippetsType === types[0]
      ? `${BACKEND_URL}/api/extension/snippets`
      : `${BACKEND_URL}/api/extension/snippets/private`;

  const response = await axios.get(endpoint, {
    headers: { Authorization: token },
  });

  const snippets = (response.data.data as snippet[]) || [];

  if (snippets.length === 0) {
    vscode.window.showInformationMessage("No snippets found.");
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
    editor.edit((edit) => {
      const position = editor.selection.active;
      edit.insert(position, selectedSnippet.code);
    });
  }
}

export async function handleLogin(
  context: vscode.ExtensionContext
): Promise<boolean> {
  return new Promise((resolve) => {
    const inputBox = vscode.window.createInputBox();
    inputBox.placeholder = "Enter api key";
    inputBox.show();

    inputBox.onDidAccept(async () => {
      const apiKey = inputBox.value.trim();
      inputBox.dispose();

      if (!apiKey) {
        vscode.window.showErrorMessage("API key cannot be empty");
        resolve(false);
        return;
      }

      try {
        const isValid = await validateApiKey(apiKey);

        if (isValid) {
          await context.secrets.store("ApiKey", apiKey);
          vscode.window.showInformationMessage("API key saved successfully!");
          resolve(true);
        } else {
          vscode.window.showErrorMessage("Invalid API key");
          resolve(false);
        }
      } catch (error) {
        vscode.window.showErrorMessage("Error validating API key");
        resolve(false);
      }
    });

    inputBox.onDidHide(() => {
      inputBox.dispose();
      resolve(false);
    });
  });
}
