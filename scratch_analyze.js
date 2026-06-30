const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const componentsDir = path.join(__dirname, 'components');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.expo' && file !== 'assets' && file !== 'scratch') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(rootDir);
const componentFiles = getAllFiles(componentsDir);

const unusedComponents = [];

componentFiles.forEach(comp => {
  const compName = path.parse(comp).name;
  if (compName === 'index' || compName === 'types' || compName.includes('Data') || compName.includes('Sequence') || compName === 'lessonBottomSheetBus' || compName === 'useLessonModules') {
    return; // skip index and types and utilities
  }
  
  let isUsed = false;
  for (const file of allFiles) {
    if (file === comp) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    // Check if the component name is used
    const regex = new RegExp(`\\b${compName}\\b`, 'g');
    if (regex.test(content)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    unusedComponents.push(comp);
  }
});

console.log("=== UNUSED COMPONENTS ===");
unusedComponents.forEach(c => console.log(c.replace(__dirname, '')));
console.log("\n=== TOTAL UNUSED: " + unusedComponents.length + " ===");
