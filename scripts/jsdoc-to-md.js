/* eslint-disable import/no-extraneous-dependencies */
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
// const { replaceImport } = require('@conflux-dev/jsdoc-tsimport-plugin');

const DOC_FOLDER = './docs/api/';

const files = [{
  source: './src/rpc/txpool.js',
  name: 'txpool.md',
}, {
  source: './src/rpc/pos.js',
  name: 'PoS.md',
}];

/**
 * A regex to capture all doc comments.
 */
const docCommentsRegex = /\/\*\*\s*(?:[^\*]|(?:\*(?!\/)))*\*\//g;

/**
 * Finds a ts import.
 */
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

async function renderFile(fileMeta) {
  let source = fs.readFileSync(fileMeta.source, 'utf8');
  source = replaceTSImport({
    source,
  });
  const result = await jsdoc2md.render({
    // files: fileMeta.source,
    source,
  });
  fs.writeFileSync(`${DOC_FOLDER}${fileMeta.name}`, result);
}

async function main() {
  for (const file of files) {
    await renderFile(file);
  }
}

main().catch(console.error);


