const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const code = fs.readFileSync('d:/edulab/src/components/theory/SubtopicSection.jsx', 'utf-8');
try {
  acorn.Parser.extend(jsx()).parse(code, { ecmaVersion: 2020, sourceType: 'module' });
  console.log('Valid JSX');
} catch (e) {
  console.error('Invalid JSX:', e.message);
  console.error('At line', e.loc.line, 'column', e.loc.column);
}
