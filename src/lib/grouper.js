/**
 * Change grouper for organizing similar changes
 */

const { GITMOJIS } = require("./gitmojis");

/**
 * Group changes by similarity for better commit messages
 * @param {Array} diffLines - Array of git diff lines
 * @returns {Object} Grouped changes
 */
function groupChanges(diffLines) {
  const groups = {
    features: [],
    fixes: [],
    docs: [],
    tests: [],
    config: [],
    deps: [],
    style: [],
    refactor: [],
    build: [],
    ci: [],
    chore: [],
  };

  diffLines.forEach((line) => {
    const [status, ...filePathParts] = line.split("\t");
    const filePath = filePathParts.join("\t");

    if (filePath.includes("test") || filePath.includes("spec")) {
      groups.tests.push(line);
    } else if (filePath.includes("doc") || filePath.endsWith(".md")) {
      groups.docs.push(line);
    } else if (
      filePath.includes("package.json") ||
      filePath.includes("yarn.lock") ||
      filePath.includes("package-lock.json")
    ) {
      groups.deps.push(line);
    } else if (
      filePath.includes(".github") ||
      filePath.includes(".gitlab") ||
      filePath.includes("jenkins") ||
      filePath.includes("travis")
    ) {
      groups.ci.push(line);
    } else if (filePath.includes("config") || filePath.includes(".env")) {
      groups.config.push(line);
    } else if (
      filePath.includes("style") ||
      filePath.includes("css") ||
      filePath.includes("scss") ||
      filePath.includes("less")
    ) {
      groups.style.push(line);
    } else if (
      filePath.includes("build") ||
      filePath.includes("webpack") ||
      filePath.includes("vite") ||
      filePath.includes("rollup")
    ) {
      groups.build.push(line);
    } else if (status.startsWith("D")) {
      groups.fixes.push(line);
    } else if (status.startsWith("A")) {
      groups.features.push(line);
    } else {
      groups.refactor.push(line);
    }
  });

  return groups;
}

/**
 * Generate multiple commit messages for grouped changes
 * @param {Object} groups - Grouped changes from groupChanges
 * @returns {Array} Array of commit objects
 */
function generateGroupedCommits(groups) {
  const commits = [];

  if (groups.features.length > 0) {
    commits.push({
      type: "feat",
      description: `add ${groups.features.length} new file${
        groups.features.length > 1 ? "s" : ""
      }`,
      files: groups.features,
    });
  }

  if (groups.fixes.length > 0) {
    commits.push({
      type: "fix",
      description: `fix ${groups.fixes.length} file${
        groups.fixes.length > 1 ? "s" : ""
      }`,
      files: groups.fixes,
    });
  }

  if (groups.docs.length > 0) {
    commits.push({
      type: "docs",
      description: `update ${groups.docs.length} documentation file${
        groups.docs.length > 1 ? "s" : ""
      }`,
      files: groups.docs,
    });
  }

  if (groups.tests.length > 0) {
    commits.push({
      type: "test",
      description: `add ${groups.tests.length} test file${
        groups.tests.length > 1 ? "s" : ""
      }`,
      files: groups.tests,
    });
  }

  if (groups.config.length > 0) {
    commits.push({
      type: "config",
      description: `update ${groups.config.length} configuration file${
        groups.config.length > 1 ? "s" : ""
      }`,
      files: groups.config,
    });
  }

  if (groups.deps.length > 0) {
    commits.push({
      type: "deps",
      description: `update ${groups.deps.length} dependenc${
        groups.deps.length > 1 ? "ies" : "y"
      }`,
      files: groups.deps,
    });
  }

  if (groups.style.length > 0) {
    commits.push({
      type: "style",
      description: `update ${groups.style.length} style file${
        groups.style.length > 1 ? "s" : ""
      }`,
      files: groups.style,
    });
  }

  if (groups.refactor.length > 0) {
    commits.push({
      type: "refactor",
      description: `refactor ${groups.refactor.length} file${
        groups.refactor.length > 1 ? "s" : ""
      }`,
      files: groups.refactor,
    });
  }

  if (groups.build.length > 0) {
    commits.push({
      type: "build",
      description: `update ${groups.build.length} build file${
        groups.build.length > 1 ? "s" : ""
      }`,
      files: groups.build,
    });
  }

  if (groups.ci.length > 0) {
    commits.push({
      type: "ci",
      description: `update ${groups.ci.length} CI file${
        groups.ci.length > 1 ? "s" : ""
      }`,
      files: groups.ci,
    });
  }

  if (groups.chore.length > 0) {
    commits.push({
      type: "chore",
      description: `update ${groups.chore.length} chore file${
        groups.chore.length > 1 ? "s" : ""
      }`,
      files: groups.chore,
    });
  }

  return commits;
}

module.exports = {
  groupChanges,
  generateGroupedCommits,
};
