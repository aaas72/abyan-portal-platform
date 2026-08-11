const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.service.ts')) filelist.push(dirFile);
    }
  });
  return filelist;
}

const services = walkSync(path.join(__dirname, '../src'));

services.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace .find().exec() with .find().limit(100).lean().exec()
  // Some might be .find({ ... }).exec()
  // We want to safely insert .limit(100).lean() before .exec()
  content = content.replace(/\.find\(([^)]*)\)\s*\.exec\(\)/g, '.find($1).limit(100).lean().exec()');
  
  // Replace .find().sort(...).exec() with .find().sort(...).limit(100).lean().exec()
  content = content.replace(/\.find\(([^)]*)\)(.*?)\.exec\(\)/g, (match, p1, p2) => {
    if (p2.includes('.limit(')) {
       if (!p2.includes('.lean(')) {
           return `.find(${p1})${p2}.lean().exec()`;
       }
       return match;
    }
    if (p2.includes('.lean(')) {
        return `.find(${p1})${p2}.limit(100).exec()`;
    }
    return `.find(${p1})${p2}.limit(100).lean().exec()`;
  });
  
  // Replace .findOne(...).exec() to include .lean()
  content = content.replace(/\.findOne\(([^)]*)\)(.*?)\.exec\(\)/g, (match, p1, p2) => {
    if (!p2.includes('.lean(')) {
        return `.findOne(${p1})${p2}.lean().exec()`;
    }
    return match;
  });
  
  // Replace .findById(...).exec() to include .lean()
  content = content.replace(/\.findById\(([^)]*)\)(.*?)\.exec\(\)/g, (match, p1, p2) => {
    if (!p2.includes('.lean(')) {
        return `.findById(${p1})${p2}.lean().exec()`;
    }
    return match;
  });

  fs.writeFileSync(file, content);
});

console.log('Fixed unbounded queries and added lean() to services.');
