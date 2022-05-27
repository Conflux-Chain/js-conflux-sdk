const fs = require('fs');
const path = require('path');

const toReplace = 'constructor: ContractConstructor;';
const fileName = path.join(__dirname, '../dist/types/contract/index.d.ts');
const content = fs.readFileSync(fileName, 'utf-8');
const replaced = content.replace(toReplace, `// ${toReplace}`);
fs.writeFileSync(fileName, replaced);
