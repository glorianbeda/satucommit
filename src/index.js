/**
 * satucommit - AI Agent helper for generating semantic git commits
 * Main entry point for the library
 */

// Export all library modules
const { GITMOJIS } = require("./lib/gitmojis");
const { COMMIT_TYPES } = require("./lib/commit-types");
const { COMMON_SCOPES } = require("./lib/scopes");
const {
  getGitDiff,
  getGitStatus,
  isGitRepository,
  createCommit,
} = require("./lib/git");
const { analyzeChanges } = require("./lib/analyzer");
const {
  generateCommitMessage,
  formatCommitMessage,
} = require("./lib/generator");
const { groupChanges, generateGroupedCommits } = require("./lib/grouper");

module.exports = {
  // Gitmoji mappings
  GITMOJIS,

  // Commit types
  COMMIT_TYPES,

  // Common scopes
  COMMON_SCOPES,

  // Git utilities
  getGitDiff,
  getGitStatus,
  isGitRepository,
  createCommit,

  // Change analysis
  analyzeChanges,

  // Message generation
  generateCommitMessage,
  formatCommitMessage,

  // Change grouping
  groupChanges,
  generateGroupedCommits,
};
