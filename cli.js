#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");

// Import from modular structure
const {
  GITMOJIS,
  COMMIT_TYPES,
  COMMON_SCOPES,
  getGitDiff,
  getGitStatus,
  isGitRepository,
  createCommit,
  analyzeChanges,
  generateCommitMessage,
  formatCommitMessage,
  groupChanges,
  generateGroupedCommits,
} = require("./src/index");

const program = new Command();

program
  .name("satucommit")
  .description(
    "AI Agent helper for generating semantic git commits with gitmoji"
  )
  .version("1.0.0");

// Generate commit message command
program
  .command("generate")
  .description("Generate a semantic commit message based on staged changes")
  .option("-t, --type <type>", "Commit type (feat, fix, docs, etc.)")
  .option("-s, --scope <scope>", "Commit scope")
  .option("-d, --description <description>", "Commit description")
  .option("-b, --body <body>", "Commit body")
  .option("-f, --footer <footer>", "Commit footer")
  .option("--breaking", "Mark as breaking change")
  .option("-g, --group", "Group changes and generate multiple commits")
  .option("--dry-run", "Show commit message without committing")
  .action((options) => {
    try {
      // Check if we're in a git repository
      if (!isGitRepository()) {
        console.error(chalk.red("Error: Not a git repository"));
        process.exit(1);
      }

      const diffLines = getGitDiff();

      if (diffLines.length === 0) {
        console.log(
          chalk.yellow(
            "No staged changes found. Please stage your changes first using:"
          )
        );
        console.log(chalk.cyan("  git add <files>"));
        console.log(chalk.cyan("  git add ."));
        process.exit(0);
      }

      console.log(chalk.blue("📊 Analyzing staged changes..."));
      console.log(chalk.gray("─".repeat(50)));

      const changes = analyzeChanges(diffLines);

      console.log(chalk.green(`✓ Added: ${changes.added.length}`));
      console.log(chalk.yellow(`✓ Modified: ${changes.modified.length}`));
      console.log(chalk.red(`✓ Deleted: ${changes.deleted.length}`));
      console.log(chalk.cyan(`✓ Renamed: ${changes.renamed.length}`));
      console.log(chalk.gray("─".repeat(50)));

      if (options.group) {
        // Generate grouped commits
        console.log(chalk.blue("\n🔄 Grouping changes by similarity..."));
        const groups = groupChanges(diffLines);
        const commits = generateGroupedCommits(groups);

        if (commits.length === 0) {
          console.log(chalk.yellow("No changes to commit"));
          process.exit(0);
        }

        console.log(
          chalk.green(
            `\n✓ Generated ${commits.length} commit message${
              commits.length > 1 ? "s" : ""
            }:\n`
          )
        );

        commits.forEach((commit, index) => {
          const gitmoji = GITMOJIS[commit.type] || GITMOJIS.feat;
          const message = formatCommitMessage(
            commit.type,
            "",
            commit.description
          );
          console.log(chalk.cyan(`Commit ${index + 1}:`));
          console.log(chalk.white(`  ${message}`));
          console.log(chalk.gray(`  Files: ${commit.files.length}`));
        });

        if (!options.dryRun) {
          console.log(chalk.gray("\n─".repeat(50)));
          console.log(
            chalk.yellow("⚠️  Grouped commits require manual execution.")
          );
          console.log(
            chalk.cyan("Please review and commit each group separately.")
          );
        }
      } else {
        // Generate single commit message
        let commitMessage;

        if (options.type && options.description) {
          // User provided custom message
          commitMessage = formatCommitMessage(
            options.type,
            options.scope || "",
            options.description,
            options.body || "",
            options.footer || "",
            options.breaking
          );
        } else {
          // Auto-generate message from changes
          const description = options.description || "update project files";
          commitMessage = generateCommitMessage(
            changes,
            description,
            options.breaking
          );
        }

        console.log(chalk.green("\n✓ Generated commit message:\n"));
        console.log(chalk.white(commitMessage));
        console.log(chalk.gray("\n─".repeat(50)));

        if (!options.dryRun) {
          // Execute the commit
          if (createCommit(commitMessage)) {
            console.log(chalk.green("\n✅ Commit successful!"));
          } else {
            process.exit(1);
          }
        } else {
          console.log(chalk.yellow("\n🔍 Dry run mode - no commit was made"));
        }
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  });

// Show available commit types
program
  .command("types")
  .description("Show available commit types")
  .action(() => {
    console.log(chalk.blue("📋 Available Commit Types:\n"));

    Object.entries(COMMIT_TYPES).forEach(([type, description]) => {
      const gitmoji = GITMOJIS[type] || "";
      console.log(
        chalk.cyan(`${gitmoji} ${type.padEnd(15)}`) +
          chalk.gray(` - ${description}`)
      );
    });
  });

// Show available scopes
program
  .command("scopes")
  .description("Show common commit scopes")
  .action(() => {
    console.log(chalk.blue("📋 Common Commit Scopes:\n"));

    COMMON_SCOPES.forEach((scope) => {
      console.log(chalk.cyan(`  • ${scope}`));
    });
  });

// Interactive mode
program
  .command("interactive")
  .alias("i")
  .description("Interactive mode to build commit message")
  .action(() => {
    console.log(chalk.blue("🎯 Interactive Commit Builder\n"));
    console.log(chalk.gray("─".repeat(50)));

    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (prompt) => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };

    (async () => {
      try {
        // Check if we're in a git repository
        if (!isGitRepository()) {
          console.error(chalk.red("Error: Not a git repository"));
          rl.close();
          process.exit(1);
        }

        const diffLines = getGitDiff();

        if (diffLines.length === 0) {
          console.log(
            chalk.yellow(
              "No staged changes found. Please stage your changes first using:"
            )
          );
          console.log(chalk.cyan("  git add <files>"));
          console.log(chalk.cyan("  git add ."));
          rl.close();
          process.exit(0);
        }

        const changes = analyzeChanges(diffLines);

        console.log(chalk.green(`✓ Added: ${changes.added.length}`));
        console.log(chalk.yellow(`✓ Modified: ${changes.modified.length}`));
        console.log(chalk.red(`✓ Deleted: ${changes.deleted.length}`));
        console.log(chalk.gray("─".repeat(50)));

        // Suggest type based on changes
        let suggestedType = "feat";
        if (changes.types.size > 0) {
          const typePriority = [
            "fix",
            "feat",
            "test",
            "docs",
            "style",
            "refactor",
            "perf",
            "build",
            "ci",
            "chore",
            "config",
            "deps",
          ];
          for (const t of typePriority) {
            if (changes.types.has(t)) {
              suggestedType = t;
              break;
            }
          }
        }

        console.log(
          chalk.blue(
            `\n📝 Suggested type: ${chalk.cyan(suggestedType)} (${
              COMMIT_TYPES[suggestedType]
            })`
          )
        );

        const type =
          (await question(
            chalk.cyan("Commit type (feat, fix, docs, etc.): ") +
              chalk.gray(`[${suggestedType}] `)
          )) || suggestedType;
        const scope = await question(chalk.cyan("Scope (optional): "));
        const description = await question(chalk.cyan("Description: "));
        const breaking =
          (await question(chalk.cyan("Breaking change? (y/N): "))) === "y";
        const body = await question(
          chalk.cyan("Body (optional, press Enter to skip): ")
        );
        const footer = await question(
          chalk.cyan("Footer (optional, press Enter to skip): ")
        );

        const commitMessage = formatCommitMessage(
          type,
          scope,
          description,
          body,
          footer,
          breaking
        );

        console.log(chalk.gray("\n─".repeat(50)));
        console.log(chalk.green("\n✓ Generated commit message:\n"));
        console.log(chalk.white(commitMessage));
        console.log(chalk.gray("\n─".repeat(50)));

        const confirm = await question(
          chalk.cyan("\nCommit with this message? (Y/n): ")
        );

        if (confirm.toLowerCase() !== "n") {
          if (createCommit(commitMessage)) {
            console.log(chalk.green("\n✅ Commit successful!"));
          } else {
            console.error(chalk.red("\n❌ Commit failed"));
          }
        } else {
          console.log(chalk.yellow("\n⚠️  Commit cancelled"));
        }

        rl.close();
      } catch (error) {
        console.error(chalk.red("Error:"), error.message);
        rl.close();
        process.exit(1);
      }
    })();
  });

// Quick commit command
program
  .command("quick")
  .alias("q")
  .description("Quick commit with auto-generated message")
  .option(
    "-d, --description <description>",
    "Commit description",
    "update project files"
  )
  .option("--dry-run", "Show commit message without committing")
  .action((options) => {
    try {
      // Check if we're in a git repository
      if (!isGitRepository()) {
        console.error(chalk.red("Error: Not a git repository"));
        process.exit(1);
      }

      const diffLines = getGitDiff();

      if (diffLines.length === 0) {
        console.log(
          chalk.yellow(
            "No staged changes found. Please stage your changes first using:"
          )
        );
        console.log(chalk.cyan("  git add <files>"));
        console.log(chalk.cyan("  git add ."));
        process.exit(0);
      }

      const changes = analyzeChanges(diffLines);
      const commitMessage = generateCommitMessage(changes, options.description);

      console.log(chalk.green("✓ Generated commit message:\n"));
      console.log(chalk.white(commitMessage));
      console.log(chalk.gray("\n─".repeat(50)));

      if (!options.dryRun) {
        if (createCommit(commitMessage)) {
          console.log(chalk.green("\n✅ Commit successful!"));
        } else {
          process.exit(1);
        }
      } else {
        console.log(chalk.yellow("\n🔍 Dry run mode - no commit was made"));
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error.message);
      process.exit(1);
    }
  });

// Show help by default
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
