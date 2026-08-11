const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // In DTOs: `image?: string;` -> `images?: string[];`
      if (content.includes('image?: string;')) {
        content = content.replace(/image\?:\s*string;/g, 'images?: string[];');
        modified = true;
      }
      
      // In Schemas: `@Prop() image: string;` -> `@Prop({ type: [String], default: [] }) images: string[];`
      if (content.match(/@Prop\([^)]*\)\s*image:\s*string;/)) {
        content = content.replace(/@Prop\(([^)]*)\)\s*image:\s*string;/g, '@Prop({ type: [String], default: [] })\n  images: string[];');
        modified = true;
      }
      
      // `@Prop() \n image: string;` (without args)
      if (content.match(/@Prop\(\)\s*image:\s*string;/)) {
        content = content.replace(/@Prop\(\)\s*image:\s*string;/g, '@Prop({ type: [String], default: [] })\n  images: string[];');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done');
