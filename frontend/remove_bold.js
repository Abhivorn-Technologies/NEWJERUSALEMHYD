const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // We find matches of className="...", className={'...'}, className={`...`}
  // and replace the bold classes unless the line contains <h[1-6]
  
  let lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // If line has a heading tag, skip removing bold classes from this line
    if (/<h[1-6]\b/.test(line)) {
      continue;
    }
    
    // Check if it has bold classes
    if (/\bfont-(bold|semibold|medium)\b/.test(line)) {
      lines[i] = line.replace(/\bfont-(bold|semibold|medium)\b/g, '');
      modified = true;
    }
  }

  if (modified) {
    let newContent = lines.join('\n');
    // clean up multiple spaces inside className strings, if any
    newContent = newContent.replace(/className="([^"]*)"/g, (m, p1) => {
      return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
    });
    fs.writeFileSync(filePath, newContent);
    console.log("Updated: " + filePath);
  }
}

walkDir('d:/NEWJERUSALEMHYD/frontend/src/app/admin/dashboard', processFile);
