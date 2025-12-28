/**
 * satucommit API for AI Agent Integration
 *
 * This module provides a simple programmatic API for AI agents
 * to generate and execute semantic git commits.
 */

const {
  getGitDiff,
  isGitRepository,
  createCommit,
  analyzeChanges,
  generateCommitMessage,
  formatCommitMessage,
  groupChanges,
  generateGroupedCommits,
} = require("./index");

/**
 * Simple API for AI agents to generate and execute commits
 */
class SatuCommitAPI {
  constructor() {
    this.lastAnalysis = null;
    this.lastCommitMessage = null;
  }

  /**
   * Check if current directory is a git repository
   * @returns {boolean} True if in git repository
   */
  isGitRepo() {
    return isGitRepository();
  }

  /**
   * Get current staged changes
   * @returns {Array} Array of staged file changes
   */
  getStagedChanges() {
    const diffLines = getGitDiff();
    this.lastAnalysis = analyzeChanges(diffLines);
    return this.lastAnalysis;
  }

  /**
   * Generate a commit message based on staged changes
   * @param {Object} options - Options for commit message generation
   * @param {string} options.description - Custom description (optional)
   * @param {string} options.type - Custom commit type (optional)
   * @param {string} options.scope - Custom commit scope (optional)
   * @param {boolean} options.breaking - Mark as breaking change (optional)
   * @param {boolean} options.group - Group changes and generate multiple commits (optional)
   * @returns {string|Array} Generated commit message(s)
   */
  generate(options = {}) {
    const {
      description = "update project files",
      type = null,
      scope = null,
      breaking = false,
      group = false,
    } = options;

    const diffLines = getGitDiff();

    if (diffLines.length === 0) {
      return null;
    }

    const changes = analyzeChanges(diffLines);
    this.lastAnalysis = changes;

    if (group) {
      const groups = groupChanges(diffLines);
      const commits = generateGroupedCommits(groups);
      return commits.map((commit) => ({
        message: formatCommitMessage(
          commit.type,
          scope || "",
          commit.description
        ),
        type: commit.type,
        files: commit.files,
      }));
    }

    let commitMessage;
    if (type && description) {
      commitMessage = formatCommitMessage(
        type,
        scope || "",
        description,
        "",
        "",
        breaking
      );
    } else {
      commitMessage = generateCommitMessage(changes, description, breaking);
    }

    this.lastCommitMessage = commitMessage;
    return commitMessage;
  }

  /**
   * Execute a commit with the given message
   * @param {string} message - Commit message
   * @returns {boolean} True if commit was successful
   */
  commit(message) {
    if (!message) {
      message = this.lastCommitMessage;
    }

    if (!message) {
      throw new Error(
        "No commit message provided. Call generate() first or provide a message."
      );
    }

    return createCommit(message);
  }

  /**
   * Generate and commit in one step
   * @param {Object} options - Options for commit message generation
   * @returns {boolean} True if commit was successful
   */
  commitAuto(options = {}) {
    const message = this.generate(options);

    if (!message) {
      console.log("No staged changes to commit");
      return false;
    }

    return this.commit(message);
  }

  /**
   * Get suggestions for commit type and scope based on changes
   * @returns {Object} Suggestions object
   */
  getSuggestions() {
    const changes = this.getStagedChanges();

    if (!changes || changes.types.size === 0) {
      return {
        type: "feat",
        scope: "",
        description: "update project files",
      };
    }

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
    let suggestedType = "feat";
    for (const t of typePriority) {
      if (changes.types.has(t)) {
        suggestedType = t;
        break;
      }
    }

    let suggestedScope = "";
    if (changes.scopes.size > 0) {
      suggestedScope = Array.from(changes.scopes)[0];
    }

    return {
      type: suggestedType,
      scope: suggestedScope,
      description: this._generateDescription(changes),
    };
  }

  /**
   * Get analysis of staged changes
   * @returns {Object} Analysis results
   */
  getAnalysis() {
    if (!this.lastAnalysis) {
      this.getStagedChanges();
    }
    return this.lastAnalysis;
  }

  /**
   * Generate a description based on changes
   * @private
   * @param {Object} changes - Analysis results
   * @returns {string} Generated description
   */
  _generateDescription(changes) {
    const parts = [];

    if (changes.added.length > 0) {
      parts.push(
        `add ${changes.added.length} file${changes.added.length > 1 ? "s" : ""}`
      );
    }
    if (changes.modified.length > 0) {
      parts.push(
        `update ${changes.modified.length} file${
          changes.modified.length > 1 ? "s" : ""
        }`
      );
    }
    if (changes.deleted.length > 0) {
      parts.push(
        `remove ${changes.deleted.length} file${
          changes.deleted.length > 1 ? "s" : ""
        }`
      );
    }

    return parts.length > 0 ? parts.join(", ") : "update project files";
  }
}

// Create singleton instance
const api = new SatuCommitAPI();

// Export both the class and the singleton instance
module.exports = {
  SatuCommitAPI,
  api,

  // Convenience functions for quick usage
  generate: (options) => api.generate(options),
  commit: (message) => api.commit(message),
  commitAuto: (options) => api.commitAuto(options),
  getSuggestions: () => api.getSuggestions(),
  getAnalysis: () => api.getAnalysis(),
  isGitRepo: () => api.isGitRepo(),
  getStagedChanges: () => api.getStagedChanges(),
};
