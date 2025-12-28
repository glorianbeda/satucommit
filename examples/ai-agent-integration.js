/**
 * Example: AI Agent Integration with satucommit
 *
 * This example demonstrates how AI agents (like KiloCode, OpenCode, Gemini CLI, etc.)
 * can integrate with satucommit programmatically.
 */

const { api } = require("../src/api");

console.log("🤖 AI Agent Integration Example\n");
console.log("=".repeat(50));

// Step 1: Check if we're in a git repository
console.log("\n📋 Step 1: Checking git repository...");
if (!api.isGitRepo()) {
  console.error("❌ Not a git repository. Please initialize git first.");
  process.exit(1);
}
console.log("✅ Git repository detected");

// Step 2: Get staged changes
console.log("\n📋 Step 2: Analyzing staged changes...");
const changes = api.getStagedChanges();
console.log(
  `✅ Found ${changes.added.length} added, ${changes.modified.length} modified, ${changes.deleted.length} deleted files`
);

// Step 3: Get suggestions
console.log("\n📋 Step 3: Getting commit suggestions...");
const suggestions = api.getSuggestions();
console.log(`✅ Suggested type: ${suggestions.type}`);
console.log(`✅ Suggested scope: ${suggestions.scope || "none"}`);
console.log(`✅ Suggested description: ${suggestions.description}`);

// Step 4: Generate commit message
console.log("\n📋 Step 4: Generating commit message...");
const message = api.generate({
  description: suggestions.description,
  type: suggestions.type,
  scope: suggestions.scope,
});
console.log(`✅ Generated message:\n   ${message}`);

// Step 5: Commit (commented out for safety)
console.log("\n📋 Step 5: Committing changes...");
// Uncomment the line below to actually commit:
// const success = api.commit(message);
// if (success) {
//   console.log('✅ Commit successful!');
// } else {
//   console.error('❌ Commit failed');
// }
console.log("⚠️  Commit skipped (uncomment the code to actually commit)");

console.log("\n" + "=".repeat(50));
console.log("✅ Example completed!\n");

// Example 2: Auto-commit with custom options
console.log("📋 Example 2: Auto-commit with custom options...\n");
console.log("Code:");
console.log(`
const success = api.commitAuto({
  description: 'implement user authentication',
  type: 'feat',
  scope: 'auth',
  breaking: false
});

if (success) {
  console.log('✅ Commit successful!');
}
`);

// Example 3: Grouped commits
console.log("\n📋 Example 3: Grouped commits...\n");
console.log("Code:");
console.log(`
const commits = api.generate({ group: true });

if (Array.isArray(commits)) {
  commits.forEach((commit, index) => {
    console.log(\`Commit \${index + 1}: \${commit.message}\`);
    api.commit(commit.message);
  });
}
`);

console.log("\n" + "=".repeat(50));
console.log("📖 For more information, see README.md\n");
