#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Gitmoji mapping for different commit types
const GITMOJIS = {
  feat: "✨",
  fix: "🐛",
  docs: "📝",
  style: "💄",
  refactor: "♻️",
  perf: "⚡",
  test: "✅",
  build: "📦",
  ci: "👷",
  chore: "🧹",
  revert: "⏪",
  init: "🎉",
  wip: "🚧",
  security: "🔒",
  config: "🔧",
  deps: "➕",
  remove: "➖",
  update: "⬆️",
  downgrade: "⬇️",
  branch: "🌿",
  merge: "🔀",
  tag: "🏷️",
  release: "🚀",
  deploy: "🎯",
  locale: "🌐",
  accessibility: "♿",
  design: "🎨",
  content: "✍️",
  translation: "🌍",
  email: "📧",
  analytics: "📊",
  seo: "🔍",
  performance: "⚡",
  hotfix: "🚑",
  breaking: "💥",
  license: "⚖️",
  ignore: "🙈",
  workflow: "📋",
  infrastructure: "🏗️",
  database: "🗄️",
  api: "🔌",
  ui: "🖼️",
  ux: "🎯",
  mobile: "📱",
  desktop: "💻",
  server: "🖥️",
  cloud: "☁️",
  monitoring: "📈",
  logging: "📋",
  caching: "💾",
  validation: "✅",
  formatting: "💄",
  linting: "🔍",
  types: "📝",
  comments: "💬",
  documentation: "📚",
  examples: "📖",
  templates: "📄",
  scaffolding: "🏗️",
  migration: "🔄",
  backup: "💾",
  restore: "📦",
  export: "📤",
  import: "📥",
  download: "⬇️",
  upload: "⬆️",
  install: "📥",
  uninstall: "📤",
  upgrade: "⬆️",
  patch: "🩹",
  experimental: "🧪",
  deprecated: "⚠️",
  removed: "🗑️",
  added: "➕",
  changed: "🔄",
  fixed: "🐛",
  improved: "⚡",
  optimized: "⚡",
  simplified: "🧹",
  refactored: "♻️",
  reorganized: "📦",
  renamed: "🏷️",
  moved: "📦",
  copied: "📋",
  deleted: "🗑️",
  created: "✨",
  updated: "⬆️",
  modified: "🔄",
  replaced: "🔄",
  merged: "🔀",
  split: "✂️",
  extracted: "📦",
  inlined: "📦",
  extracted_to_file: "📦",
  inlined_from_file: "📦",
  extracted_to_module: "📦",
  inlined_from_module: "📦",
  extracted_to_function: "📦",
  inlined_from_function: "📦",
};

// Semantic commit types with descriptions
const COMMIT_TYPES = {
  feat: "A new feature",
  fix: "A bug fix",
  docs: "Documentation only changes",
  style: "Changes that do not affect the meaning of the code",
  refactor: "A code change that neither fixes a bug nor adds a feature",
  perf: "A code change that improves performance",
  test: "Adding missing tests or correcting existing tests",
  build: "Changes that affect the build system or external dependencies",
  ci: "Changes to CI configuration files and scripts",
  chore: "Other changes that don't modify src or test files",
  revert: "Reverts a previous commit",
  init: "Initial commit",
  wip: "Work in progress",
  security: "Security fixes",
  config: "Configuration changes",
  deps: "Adding dependencies",
  remove: "Removing dependencies",
  update: "Updating dependencies",
  downgrade: "Downgrading dependencies",
  branch: "Branch operations",
  merge: "Merge operations",
  tag: "Tag operations",
  release: "Release operations",
  deploy: "Deployment operations",
  locale: "Localization changes",
  accessibility: "Accessibility improvements",
  design: "Design changes",
  content: "Content changes",
  translation: "Translation changes",
  email: "Email changes",
  analytics: "Analytics changes",
  seo: "SEO changes",
  performance: "Performance improvements",
  hotfix: "Hotfix",
  breaking: "Breaking changes",
  license: "License changes",
  ignore: "Ignore changes",
  workflow: "Workflow changes",
  infrastructure: "Infrastructure changes",
  database: "Database changes",
  api: "API changes",
  ui: "UI changes",
  ux: "UX changes",
  mobile: "Mobile changes",
  desktop: "Desktop changes",
  server: "Server changes",
  cloud: "Cloud changes",
  monitoring: "Monitoring changes",
  logging: "Logging changes",
  caching: "Caching changes",
  validation: "Validation changes",
  formatting: "Formatting changes",
  linting: "Linting changes",
  types: "Type changes",
  comments: "Comment changes",
  documentation: "Documentation changes",
  examples: "Example changes",
  templates: "Template changes",
  scaffolding: "Scaffolding changes",
  migration: "Migration changes",
  backup: "Backup changes",
  restore: "Restore changes",
  export: "Export changes",
  import: "Import changes",
  download: "Download changes",
  upload: "Upload changes",
  install: "Installation changes",
  uninstall: "Uninstallation changes",
  upgrade: "Upgrade changes",
  patch: "Patch changes",
  experimental: "Experimental changes",
  deprecated: "Deprecation changes",
  removed: "Removal changes",
  added: "Added changes",
  changed: "Changed changes",
  fixed: "Fixed changes",
  improved: "Improved changes",
  optimized: "Optimized changes",
  simplified: "Simplified changes",
  refactored: "Refactored changes",
  reorganized: "Reorganized changes",
  renamed: "Renamed changes",
  moved: "Moved changes",
  copied: "Copied changes",
  deleted: "Deleted changes",
  created: "Created changes",
  updated: "Updated changes",
  modified: "Modified changes",
  replaced: "Replaced changes",
  merged: "Merged changes",
  split: "Split changes",
  extracted: "Extracted changes",
  inlined: "Inlined changes",
  extracted_to_file: "Extracted to file changes",
  inlined_from_file: "Inlined from file changes",
  extracted_to_module: "Extracted to module changes",
  inlined_from_module: "Inlined from module changes",
  extracted_to_function: "Extracted to function changes",
  inlined_from_function: "Inlined from function changes",
};

// Scopes commonly used in projects
const COMMON_SCOPES = [
  "core",
  "ui",
  "api",
  "auth",
  "db",
  "config",
  "utils",
  "components",
  "hooks",
  "services",
  "store",
  "router",
  "middleware",
  "tests",
  "docs",
  "build",
  "deploy",
  "ci",
  "types",
  "styles",
  "assets",
  "i18n",
  "analytics",
  "monitoring",
  "logging",
  "caching",
  "validation",
  "security",
  "performance",
  "accessibility",
  "seo",
  "email",
  "notifications",
  "payments",
  "integrations",
  "webhooks",
  "scheduler",
  "queue",
  "storage",
  "backup",
  "migration",
  "database",
  "server",
  "client",
  "mobile",
  "desktop",
  "cli",
  "admin",
  "dashboard",
  "settings",
  "profile",
  "search",
  "filters",
  "pagination",
  "sorting",
  "forms",
  "modals",
  "dialogs",
  "toasts",
  "notifications",
  "loading",
  "error",
  "success",
  "warning",
  "info",
];

/**
 * Get git diff to understand changes
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
 * Analyze changes to determine commit type and scope
 */
function analyzeChanges(diffLines) {
  const changes = {
    added: [],
    modified: [],
    deleted: [],
    renamed: [],
    types: new Set(),
    scopes: new Set(),
  };

  diffLines.forEach((line) => {
    const [status, ...filePathParts] = line.split("\t");
    const filePath = filePathParts.join("\t");

    if (status.startsWith("A") || status.startsWith("??")) {
      changes.added.push(filePath);
    } else if (status.startsWith("M")) {
      changes.modified.push(filePath);
    } else if (status.startsWith("D")) {
      changes.deleted.push(filePath);
    } else if (status.startsWith("R")) {
      changes.renamed.push(filePath);
    }

    // Analyze file extensions and paths to infer type and scope
    const ext = path.extname(filePath).toLowerCase();
    const dirParts = filePath.split(path.sep);

    // Infer commit type from file changes
    if (filePath.includes("test") || filePath.includes("spec")) {
      changes.types.add("test");
    } else if (filePath.includes("doc") || filePath.endsWith(".md")) {
      changes.types.add("docs");
    } else if (
      filePath.includes("package.json") ||
      filePath.includes("yarn.lock") ||
      filePath.includes("package-lock.json")
    ) {
      changes.types.add("deps");
    } else if (
      filePath.includes(".github") ||
      filePath.includes(".gitlab") ||
      filePath.includes("jenkins") ||
      filePath.includes("travis")
    ) {
      changes.types.add("ci");
    } else if (filePath.includes("config") || filePath.includes(".env")) {
      changes.types.add("config");
    } else if (
      filePath.includes("style") ||
      filePath.includes("css") ||
      filePath.includes("scss") ||
      filePath.includes("less")
    ) {
      changes.types.add("style");
    } else if (
      filePath.includes("build") ||
      filePath.includes("webpack") ||
      filePath.includes("vite") ||
      filePath.includes("rollup")
    ) {
      changes.types.add("build");
    }

    // Infer scope from directory structure
    if (dirParts.length > 1) {
      const potentialScope = dirParts[0].toLowerCase();
      if (COMMON_SCOPES.includes(potentialScope)) {
        changes.scopes.add(potentialScope);
      }
    }
  });

  return changes;
}

/**
 * Generate commit message based on changes
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

/**
 * Group changes by similarity for better commit messages
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
  GITMOJIS,
  COMMIT_TYPES,
  COMMON_SCOPES,
  getGitDiff,
  getGitStatus,
  analyzeChanges,
  generateCommitMessage,
  formatCommitMessage,
  groupChanges,
  generateGroupedCommits,
};
