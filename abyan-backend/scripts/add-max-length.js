const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.dto.ts')) filelist.push(dirFile);
    }
  });
  return filelist;
}

const dtos = walkSync(path.join(__dirname, '../src'));

dtos.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('@IsString') && !content.includes('@MaxLength')) {
    // Add import
    content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]class-validator['"]/, (match, p1) => {
      return `import { ${p1.trim()}, MaxLength } from 'class-validator'`;
    });
  }

  // Regex to match properties that have @IsString() but no @MaxLength
  // We'll look for @IsString() and then the property name, and insert MaxLength.
  // A simpler way: just replace @IsString() with @IsString()\n  @MaxLength(500) for standard fields,
  // but if the next line or nearby contains "description" or "content", maybe 10000.
  
  // Let's do line by line
  let lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@IsString()') && !lines[i].includes('@MaxLength')) {
      // Check if MaxLength is already in the block
      let hasMax = false;
      for (let j = i - 2; j <= i + 2; j++) {
        if (lines[j] && lines[j].includes('@MaxLength')) {
          hasMax = true;
          break;
        }
      }
      if (!hasMax) {
        // Determine length based on next few lines property name
        let maxLen = 500; // default for titles, etc.
        for (let j = i + 1; j <= i + 3; j++) {
          if (lines[j]) {
            if (lines[j].match(/description|content|fullBiography|bio|history|details/i)) {
              maxLen = 10000;
              break;
            }
          }
        }
        lines[i] = lines[i] + `\n  @MaxLength(${maxLen})`;
      }
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'));
});
console.log('Added @MaxLength to all string fields.');
