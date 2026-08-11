const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir(path.join(__dirname, 'src'));

files.forEach(file => {
    if (!file.endsWith('.ts')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    // Find import { ... } from 'class-validator'
    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]class-validator['"]/g, (match, importsStr) => {
        const imports = importsStr.split(',').map(i => i.trim()).filter(i => i);
        const uniqueImports = [...new Set(imports)];
        if (imports.length !== uniqueImports.length) {
            hasChanges = true;
            return `import { ${uniqueImports.join(', ')} } from 'class-validator'`;
        }
        return match;
    });

    if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed duplicates in ${file}`);
    }
});
