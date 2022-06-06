/**
 * A regex to capture all doc comments.
 */
// eslint-disable-next-line no-useless-escape
const docCommentsRegex = /\/\*\*\s*(?:[^\*]|(?:\*(?!\/)))*\*\//g;

/**
 * Finds a ts import.
 */
// eslint-disable-next-line no-useless-escape
const importRegex = /import\(['"](\@?[\.\/_a-zA-Z0-9-\$]*)(?:\.js)?['"]\)\.?([_a-zA-Z0-9-\$]*)?/g;

function replaceTSImport(e) {
  return e.source.replace(docCommentsRegex,
    substring => {
      return substring.replace(importRegex,
        (_substring2, relImportPath, symbolName) => {
          // const moduleId = getModuleId(e.filename, relImportPath);
          const moduleId = null;
          return (moduleId) ? `module:${moduleId}${symbolName ? `~${symbolName}` : ''}` : symbolName;
        });
    });
}

module.exports = {
  replaceTSImport,
};
