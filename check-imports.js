const fs = require('fs');
const path = require('path');

function checkImportPaths(dir) {
  const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
  
  let errors = [];
  
  files.forEach(file => {
    if (!file.name.endsWith('.tsx') && !file.name.endsWith('.ts')) return;
    
    const filePath = path.join(file.path || dir, file.name);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      if (!match) return;
      
      const importPath = match[1];
      if (!importPath.includes('/src/')) return;
      
      // Calculate depth from app/ (how many folders deep from app/)
      const appPath = filePath.substring(filePath.indexOf('app') + 4); // +4 for 'app' + path.sep
      const parts = appPath.split(path.sep).filter(p => p.length > 0);
      const depth = parts.length - 1; // -1 for file name
      
      // Number of ../ needed = depth + 1 (to get back to root from current dir)
      const numLevels = depth + 1;
      const expectedPrefix = '../'.repeat(numLevels) + 'src/';
      const actualPrefix = importPath.substring(0, importPath.indexOf('src/') + 4);
      
      if (actualPrefix !== expectedPrefix) {
        errors.push({
          file: filePath,
          line: index + 1,
          message: `Wrong import path. Expected "${expectedPrefix}", got "${actualPrefix}"`,
        });
      }
    });
  });
  
  return errors;
}

const errors = checkImportPaths(path.join(__dirname, 'app'));

if (errors.length > 0) {
  console.log('Import path errors found:\n');
  errors.forEach(err => {
    console.log(`${err.file}:${err.line} - ${err.message}`);
  });
  process.exit(1);
} else {
  console.log('All import paths are correct!');
}
