const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.service.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Map legacy 'image' to 'images' in map methods if not already done
            if (content.includes('images: ') && content.includes('.images') && !content.includes('? [')) {
                // Find things like images: f.images, or images: item.images, or images: archive.images || [],
                content = content.replace(/images:\s*([a-zA-Z0-9_]+)\.images(?:\s*\|\|\s*\[\])?,/g, (match, varName) => {
                    modified = true;
                    return images: .images?.length ? .images : (.image ? [.image] : []),;
                });
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(Updated service: );
            }
        } else if (fullPath.endsWith('.schema.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            if (content.includes('images: string[]') && !content.includes('image?: string')) {
                content = content.replace(/@Prop\(\s*\{.*type:\s*\[String\].*\}\s*\)\s*images:\s*string\[\];/g, match => {
                    modified = true;
                    return match + '\n\n  @Prop()\n  image?: string; // Legacy support';
                });
                // Also handle without type: [String]
                content = content.replace(/@Prop\(\)\s*images\?:\s*string\[\];/g, match => {
                    modified = true;
                    return match + '\n\n  @Prop()\n  image?: string; // Legacy support';
                });
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(Updated schema: );
            }
        }
    }
}

processDir('src');
