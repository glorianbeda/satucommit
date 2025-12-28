# satucommit

> AI Agent helper for generating semantic git commits with gitmoji and proper grouping

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

**satucommit** is a CLI tool designed to help AI agents (and humans) generate semantic git commit messages following best practices. It automatically:

- ✨ Adds appropriate gitmojis based on commit type
- 📝 Follows semantic commit conventions
- 🔄 Groups similar changes together
- 🎯 Suggests commit types based on file changes
- 🌍 Generates commit messages in English

## 🚀 Features

- **Automatic Type Detection**: Analyzes staged files to suggest the best commit type
- **Gitmoji Support**: Automatically adds relevant emojis to commit messages
- **Semantic Conventions**: Follows industry-standard commit message format
- **Change Grouping**: Groups similar changes for better commit organization
- **Interactive Mode**: Build commit messages interactively
- **Quick Commit**: Generate and commit with a single command
- **Dry Run**: Preview commit messages without committing

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm (comes with Node.js)
- Git

## 🔧 Installation

### Installation on Linux / macOS

#### Option 1: Using the Installation Script (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/glorianbeda/satucommit.git
cd satucommit
```

2. Run the installation script:
```bash
chmod +x install.sh
./install.sh
```

3. (Optional) Create a global symlink for easier access:
```bash
npm link
```

#### Option 2: Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/glorianbeda/satucommit.git
cd satucommit
```

2. Install dependencies:
```bash
npm install
```

3. Make the CLI executable:
```bash
chmod +x cli.js
```

4. (Optional) Create a global symlink:
```bash
npm link
```

### Installation on Windows

#### Option 1: Using the Installation Script (Recommended)

1. Clone the repository:
```cmd
git clone https://github.com/glorianbeda/satucommit.git
cd satucommit
```

2. Run the installation script:
```cmd
install.bat
```

3. (Optional) Create a global symlink for easier access:
```cmd
npm link
```

#### Option 2: Manual Installation

1. Clone the repository:
```cmd
git clone https://github.com/glorianbeda/satucommit.git
cd satucommit
```

2. Install dependencies:
```cmd
npm install
```

3. (Optional) Create a global symlink:
```cmd
npm link
```

**Note:** On Windows, you can run the CLI using `node cli.js` or `satucommit` if you've run `npm link`.

## 📖 Usage

### Quick Start

1. Stage your changes:
```bash
git add .
# or
git add <specific-files>
```

2. Generate a commit message:
```bash
satucommit quick
```

### Available Commands

#### `satucommit quick` or `satucommit q`

Generate a quick commit with an auto-generated message.

```bash
satucommit quick
# or with custom description
satucommit quick -d "add new authentication feature"
```

Options:
- `-d, --description <description>`: Custom commit description (default: "update project files")
- `--dry-run`: Show commit message without committing

#### `satucommit generate`

Generate a semantic commit message based on staged changes with more control.

```bash
satucommit generate
# or with custom options
satucommit generate -t feat -s auth -d "add login functionality"
```

Options:
- `-t, --type <type>`: Commit type (feat, fix, docs, etc.)
- `-s, --scope <scope>`: Commit scope
- `-d, --description <description>`: Commit description
- `-b, --body <body>`: Commit body
- `-f, --footer <footer>`: Commit footer
- `--breaking`: Mark as breaking change
- `-g, --group`: Group changes and generate multiple commits
- `--dry-run`: Show commit message without committing

#### `satucommit interactive` or `satucommit i`

Interactive mode to build commit messages step by step.

```bash
satucommit interactive
```

This will guide you through:
1. Reviewing staged changes
2. Selecting commit type
3. Adding scope (optional)
4. Writing description
5. Adding body (optional)
6. Adding footer (optional)
7. Confirming the commit

#### `satucommit types`

Show all available commit types with descriptions.

```bash
satucommit types
```

#### `satucommit scopes`

Show common commit scopes.

```bash
satucommit scopes
```

## 🎯 Commit Types

satucommit supports the following commit types:

| Type | Emoji | Description |
|------|-------|-------------|
| `feat` | ✨ | A new feature |
| `fix` | 🐛 | A bug fix |
| `docs` | 📝 | Documentation only changes |
| `style` | 💄 | Changes that do not affect the meaning of the code |
| `refactor` | ♻️ | A code change that neither fixes a bug nor adds a feature |
| `perf` | ⚡ | A code change that improves performance |
| `test` | ✅ | Adding missing tests or correcting existing tests |
| `build` | 📦 | Changes that affect the build system or external dependencies |
| `ci` | 👷 | Changes to CI configuration files and scripts |
| `chore` | 🧹 | Other changes that don't modify src or test files |
| `revert` | ⏪ | Reverts a previous commit |
| `init` | 🎉 | Initial commit |
| `wip` | 🚧 | Work in progress |
| `security` | 🔒 | Security fixes |
| `config` | 🔧 | Configuration changes |
| `deps` | ➕ | Adding dependencies |

And many more! Use `satucommit types` to see all available types.

## 📝 Commit Message Format

satucommit generates commit messages in the following format:

```
<gitmoji> <type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
✨ feat(auth): add user login functionality

Implement JWT-based authentication with support for:
- Email/password login
- Token refresh
- Session management

Closes #123
```

## 🤖 AI Agent Integration

satucommit is designed to work seamlessly with AI agents. When an AI agent needs to commit changes:

1. The agent stages changes using `git add`
2. The agent runs `satucommit quick` or `satucommit generate`
3. satucommit analyzes the changes and generates an appropriate commit message
4. The commit is made automatically

Example AI agent workflow:
```bash
# Agent makes changes
echo "console.log('Hello, World!')" >> app.js

# Agent stages changes
git add app.js

# Agent generates commit message
satucommit quick
```

## 🔄 Change Grouping

For complex changes involving multiple files, use the group option:

```bash
satucommit generate --group
```

This will:
1. Analyze all staged files
2. Group them by similarity (features, fixes, docs, tests, etc.)
3. Generate separate commit messages for each group
4. Display the suggested commits for review

## 📂 Project Structure

```
satucommit/
├── index.js          # Core logic for commit message generation
├── cli.js            # CLI interface and commands
├── package.json      # Project configuration
├── install.sh        # Installation script for Linux/macOS
├── install.bat       # Installation script for Windows
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🎨 Examples

### Example 1: Quick Commit

```bash
# Stage changes
git add src/components/Button.js

# Quick commit
satucommit quick
```

Output:
```
✓ Generated commit message:

✨ feat(ui): update Button component

──────────────────────────────────────────────────

✅ Commit successful!
```

### Example 2: Custom Commit

```bash
# Stage changes
git add src/api/user.js tests/user.test.js

# Generate custom commit
satucommit generate -t feat -s api -d "add user CRUD operations"
```

Output:
```
✓ Generated commit message:

✨ feat(api): add user CRUD operations

──────────────────────────────────────────────────

✅ Commit successful!
```

### Example 3: Interactive Mode

```bash
# Stage changes
git add .

# Interactive commit
satucommit interactive
```

Output:
```
🎯 Interactive Commit Builder

──────────────────────────────────────────────────
✓ Added: 3
✓ Modified: 5
✓ Deleted: 0
──────────────────────────────────────────────────

📝 Suggested type: feat (A new feature)

Commit type (feat, fix, docs, etc.) [feat]: 
Scope (optional): auth
Description: implement OAuth2 authentication
Breaking change? (y/N): 
Body (optional, press Enter to skip): Add support for Google and GitHub OAuth providers
Footer (optional, press Enter to skip): Closes #45

──────────────────────────────────────────────────

✓ Generated commit message:

✨ feat(auth): implement OAuth2 authentication

Add support for Google and GitHub OAuth providers

Closes #45

──────────────────────────────────────────────────

Commit with this message? (Y/n): Y

✅ Commit successful!
```

### Example 4: Grouped Commits

```bash
# Stage multiple types of changes
git add .

# Generate grouped commits
satucommit generate --group
```

Output:
```
📊 Analyzing staged changes...
──────────────────────────────────────────────────
✓ Added: 5
✓ Modified: 3
✓ Deleted: 0
✓ Renamed: 0
──────────────────────────────────────────────────

🔄 Grouping changes by similarity...

✓ Generated 3 commit messages:

Commit 1:
  ✨ feat: add 2 new files
  Files: 2

Commit 2:
  📝 docs: update 3 documentation files
  Files: 3

Commit 3:
  ✅ test: add 3 test files
  Files: 3

──────────────────────────────────────────────────

⚠️  Grouped commits require manual execution.
Please review and commit each group separately.
```

## 🛠️ Troubleshooting

### "Not a git repository" Error

Make sure you're running satucommit inside a git repository:
```bash
git init  # If not initialized
```

### "No staged changes found"

Stage your changes first:
```bash
git add .  # Stage all changes
# or
git add <specific-files>  # Stage specific files
```

### Command Not Found

If you get "command not found" error, make sure:
1. You've run `npm link` after installation
2. The CLI is executable: `chmod +x cli.js`
3. Or use `node cli.js` instead of `satucommit`

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Inspired by [conventional commits](https://www.conventionalcommits.org/)
- Gitmojis from [gitmoji](https://gitmoji.dev/)
- Built with [Commander.js](https://www.npmjs.com/package/commander)

---

Made with ❤️ by [glorianbeda](https://github.com/glorianbeda)
