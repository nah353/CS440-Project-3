const fs = require('fs');
const path = require('path');

const targets = [
  { dir: 'server', file: '.env.example' },
  { dir: 'client', file: '.env.example' }
];

targets.forEach(({ dir, file }) => {
  const examplePath = path.join(__dirname, dir, file);
  const envPath = path.join(__dirname, dir, '.env');

  if (fs.existsSync(examplePath) && !fs.existsSync(envPath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log(`Created .env in /${dir}`);
  } else if (!fs.existsSync(examplePath)) {
    console.log(`Warning: ${file} not found in /${dir}`);
  }
});