# Share Snippets Extension

Access and insert code snippets from your Share Snippets collection directly in VS Code.

## Features

- **Browse Snippets**: Access both public and private code snippets
- **Quick Insert**: Insert snippets directly into your active editor
- **Secure Authentication**: API key-based authentication for private snippets

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Share Snippets By Piyush5784"
4. Click Install

### Manual Installation (.vsix file)

1. Download the `.vsix` file
2. Open VS Code
3. Go to Extensions (Ctrl+Shift+X)
4. Click the "..." menu
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

## Getting Started

### 1. Get Your API Key

1. Visit [Share Snippets](https://share-snippets-v0.vercel.app)
2. Sign up or log in to your account
3. Go to Settings/Profile
4. Generate or copy your API key

### 2. Configure the Extension

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Get Snippets" and select the command
4. When prompted, enter your API key
5. The extension will validate and save your key securely

## How to Use

### Accessing Snippets

1. **Open Command Palette**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. **Search Command**: Type "Get Snippets" and select it
3. **Choose Type**: Select either:
   - "All snippets" - Browse public snippets
   - "Private snippets" - Access your private snippets (requires API key)

### Inserting Snippets

1. **Select Snippet**: Choose from the list of available snippets
2. **Auto-Insert**: The snippet will be inserted at your cursor position in the active editor
3. **Ready to Use**: Start coding with your snippet!

## Commands

| Command                        | Description                | Shortcut                        |
| ------------------------------ | -------------------------- | ------------------------------- |
| `Share Snippets: Get Snippets` | Browse and insert snippets | `Ctrl+Shift+P` → "Get Snippets" |

## Configuration

### API Key Management

- **Storage**: Your API key is stored securely in VS Code's secret storage
- **Validation**: The extension validates your key before saving
- **Reset**: If you need to change your API key, simply run the command again

### Authentication Issues

If you encounter authentication errors:

1. Run "Get Snippets" command again
2. Enter a new/valid API key
3. Ensure your account is active on the Share Snippets platform

## Supported Languages

The extension works with snippets in any programming language. Snippets are displayed with their language information to help you choose the right one.

**"Invalid API key"**

- Check your API key is correct
- Ensure your account is active
- Try generating a new API key

**"Failed to fetch snippets"**

- Check your internet connection
- Verify the backend service is running
- Try again in a few moments

**"No snippets found"**

- Create some snippets on the Share Snippets platform
- Check if you're looking in the right category (public vs private)

### Getting Help

1. **Check Console**: Open VS Code Developer Tools (Help → Toggle Developer Tools) for detailed error messages
2. **Verify Setup**: Ensure your API key is valid and the backend is accessible
3. **Contact Support**: Reach out through the VS Code Marketplace or GitHub repository

## Privacy & Security

- **API Key**: Stored securely in VS Code's secret storage
- **No Data Collection**: The extension doesn't collect personal information
- **Secure Communication**: All API calls use HTTPS
- **Local Processing**: Snippet insertion happens locally in your editor

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This extension is licensed under the MIT License.

## Changelog

### Version 0.0.1

- Initial release
- Basic snippet browsing and insertion
- API key authentication
- Support for public and private snippets

---

**Made with ❤️ by Piyush5784**

For more information, visit the [Share Snippets Platform](https://share-snippets-v0.vercel.app)
