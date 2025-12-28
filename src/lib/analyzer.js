/**
 * Change analyzer for determining commit type and scope
 */

const path = require("path");
const { COMMON_SCOPES } = require("./scopes");

/**
 * Analyze changes to determine commit type and scope
 * @param {Array} diffLines - Array of git diff lines
 * @returns {Object} Analysis results
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

module.exports = { analyzeChanges };
