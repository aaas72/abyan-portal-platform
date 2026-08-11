
const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

function fixPioneers() {
  const f = path.join(srcDir, 'pioneers', 'pioneers.service.ts');
  if(!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  if(!code.includes('image: f.image')) {
    code = code.replace(/quote: f\.quote,/g, 'quote: f.quote,\n          image: f.image,');
    fs.writeFileSync(f, code);
  }
}

function fixCulture() {
  const f = path.join(srcDir, 'culture', 'culture.service.ts');
  if(!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  if(!code.includes('image: cat.visualShowcase.image')) {
    code = code.replace(/bgGradient: cat\\.visualShowcase\\.bgGradient,/g, 'bgGradient: cat.visualShowcase.bgGradient,\n              image: cat.visualShowcase.image,');
    fs.writeFileSync(f, code);
  }
  let code2 = fs.readFileSync(f, 'utf8');
  if(!code2.includes('image: f.image')) {
    code2 = code2.replace(/bgGradient: f\\.bgGradient,/g, 'bgGradient: f.bgGradient,\n          image: f.image,');
    fs.writeFileSync(f, code2);
  }
}

function fixEconomy() {
  const f = path.join(srcDir, 'economy', 'economy.service.ts');
  if(!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  if(!code.includes('image: p.image')) {
    code = code.replace(/bgGradient: p\\.bgGradient,/g, 'bgGradient: p.bgGradient,\n          image: p.image,');
    fs.writeFileSync(f, code);
  }
}

function fixLandmarks() {
  const f = path.join(srcDir, 'landmarks', 'landmarks.service.ts');
  if(!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  if(!code.includes('image: p.image')) {
    code = code.replace(/bgGradient: p\\.bgGradient,/g, 'bgGradient: p.bgGradient,\n          image: p.image,');
    fs.writeFileSync(f, code);
  }
}

function fixHighlights() {
  const f = path.join(srcDir, 'highlights', 'highlights.service.ts');
  if(!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  if(!code.includes('image: h.image')) {
    code = code.replace(/linkUrl: h\\.linkUrl,/g, 'linkUrl: h.linkUrl,\n      image: h.image,');
    fs.writeFileSync(f, code);
  }
}

fixPioneers();
fixCulture();
fixEconomy();
fixLandmarks();
fixHighlights();
console.log('Mappings fixed.');

