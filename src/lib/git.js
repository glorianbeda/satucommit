/**
 * Git utilities for interacting with git repository
 */

const { execSync } = require("child_process");

/**
 * Get git diff to understand changes
 * @returns {Array} Array of diff lines
 */
function getGitDiff() {
  try {
    const diff = execSync("git diff --cached --name-status", {
      encoding: "utf8",
    });
    return diff
      .trim()
      .split("\n")
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error getting git diff:", error.message);
    return [];
  }
}

/**
 * Get git status to understand staged changes
 * @returns {Array} Array of status lines
 */
function getGitStatus() {
  try {
    const status = execSync("git status --short", { encoding: "utf8" });
    return status
      .trim()
      .split("\n")
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error getting git status:", error.message);
    return [];
  }
}

/**
 * Check if current directory is a git repository
 * @returns {boolean} True if in git repository
 */
function isGitRepository() {
  try {
    execSync("git rev-parse --git-dir", { encoding: "utf8", stdio: "pipe" });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create a git commit
 * @param {string} message - Commit message
 * @returns {boolean} True if commit was successful
 */
function createCommit(message) {
  try {
    execSync(`git commit -m "${message}"`, { encoding: "utf8", stdio: "pipe" });
    return true;
  } catch (error) {
    console.error("Error creating commit:", error.message);
    return false;
  }
}

module.exports = {
  getGitDiff,
  getGitStatus,
  isGitRepository,
  createCommit,
};
