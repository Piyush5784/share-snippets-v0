"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.handleLogin = handleLogin;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const BACKEND_URL = "https://www.share-snippets.site";
const name = "extension_share_snippets";
async function activate(context) {
    const isFirstTime = !context.globalState.get(name);
    await context.secrets.delete("ApiKey");
    if (isFirstTime) {
        await context.globalState.update("extensionInstalled", true);
    }
    ``;
    if (!isFirstTime) {
        await context.secrets.delete("ApiKey");
    }
    const types = ["All snippets", "Private snippets"];
    const disposable = vscode.commands.registerCommand("share-snippets.getSnippets", async () => {
        const snippetsType = await vscode.window.showQuickPick(types, {
            placeHolder: "Select snippets type",
        });
        if (!snippetsType) {
            return;
        }
        let token = await context.secrets.get("ApiKey");
        if (!token) {
            const loginSuccess = await handleLogin(context);
            if (!loginSuccess) {
                return;
            }
        }
        token = await context.secrets.get("ApiKey");
        try {
            await fetchSnippet(snippetsType, token, types);
        }
        catch (error) {
            console.log(error);
            if (error) {
                await context.secrets.delete("ApiKey");
                vscode.window.showErrorMessage("Invalid API key. Please login again.");
                await handleLogin(context);
            }
            else {
                vscode.window.showErrorMessage("Failed to fetch snippets.");
            }
        }
    });
    context.subscriptions.push(disposable);
}
async function validateApiKey(token) {
    try {
        const response = await axios_1.default.get(`${BACKEND_URL}/api/extension/validate-key`, {
            headers: { Authorization: token },
        });
        console.log({ response });
        return response.data.success;
    }
    catch (error) {
        return false;
    }
}
async function fetchSnippet(snippetsType, token, types) {
    const endpoint = snippetsType === types[0]
        ? `${BACKEND_URL}/api/extension/snippets`
        : `${BACKEND_URL}/api/extension/snippets/private`;
    const response = await axios_1.default.get(endpoint, {
        headers: { Authorization: token },
    });
    const snippets = response.data.data || [];
    if (snippets.length === 0) {
        vscode.window.showInformationMessage("No snippets found.");
        return;
    }
    const snippetPick = await vscode.window.showQuickPick(snippets.map((s) => ({
        label: s.title,
        description: s.description,
        detail: s.language ? `Language: ${s.language}` : undefined,
    })), {
        placeHolder: "Select a Snippet",
        matchOnDescription: true,
        matchOnDetail: true,
    });
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
async function handleLogin(context) {
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
                }
                else {
                    vscode.window.showErrorMessage("Invalid API key");
                    resolve(false);
                }
            }
            catch (error) {
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
//# sourceMappingURL=extension.js.map