/**
 * Commit message generator
 */

const { GITMOJIS } = require("./gitmojis");

/**
 * Generate commit message based on changes
 * @param {Object} changes - Analysis results from analyzer
 * @param {string} description - Commit description
 * @param {boolean} breaking - Whether this is a breaking change
 * @returns {string} Generated commit message
 */
function generateCommitMessage(changes, description, breaking = false) {
  let type = "feat";
  let scope = "";

  // Determine the most appropriate type
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
        type = t;
        break;
      }
    }
  } else {
    // Default based on changes
    if (
      changes.deleted.length > 0 &&
      changes.added.length === 0 &&
      changes.modified.length === 0
    ) {
      type = "remove";
    } else if (changes.added.length > 0 && changes.modified.length === 0) {
      type = "feat";
    } else if (changes.added.length === 0 && changes.modified.length > 0) {
      type = "fix";
    }
  }

  // Determine scope
  if (changes.scopes.size > 0) {
    scope = Array.from(changes.scopes)[0];
  }

  // Get gitmoji
  const gitmoji = GITMOJIS[type] || GITMOJIS.feat;

  // Build commit message
  let commitMessage = `${gitmoji} ${type}`;

  if (scope) {
    commitMessage += `(${scope})`;
  }

  if (breaking) {
    commitMessage += "!";
  }

  commitMessage += `: ${description}`;

  return commitMessage;
}

/**
 * Format commit message with proper structure
 * @param {string} type - Commit type
 * @param {string} scope - Commit scope
 * @param {string} description - Commit description
 * @param {string} body - Commit body
 * @param {string} footer - Commit footer
 * @param {boolean} breaking - Whether this is a breaking change
 * @returns {string} Formatted commit message
 */
function formatCommitMessage(
  type,
  scope,
  description,
  body = "",
  footer = "",
  breaking = false
) {
  const gitmoji = GITMOJIS[type] || GITMOJIS.feat;
  let message = `${gitmoji} ${type}`;

  if (scope) {
    message += `(${scope})`;
  }

  if (breaking) {
    message += "!";
  }

  message += `: ${description}`;

  if (body) {
    message += `\n\n${body}`;
  }

  if (footer) {
    message += `\n\n${footer}`;
  }

  return message;
}

module.exports = {
  generateCommitMessage,
  formatCommitMessage,
};
