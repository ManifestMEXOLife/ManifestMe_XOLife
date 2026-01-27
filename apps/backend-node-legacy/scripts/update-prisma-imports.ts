// update-prisma-imports.ts
import fs from 'fs';
import path from 'path';

const directory = path.join(process.cwd(), 'src'); // adjust if needed
const newImport = `import prisma from './prisma.config';`;

function updateImports(dir: string) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      updateImports(fullPath); // recursive
    } else if (/\.(ts|js)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf-8');

      // Match old PrismaClient import
      const regex = /import\s*{\s*PrismaClient\s*}\s*from\s*['"]@prisma\/client['"];?/g;

      if (regex.test(content)) {
        content = content.replace(regex, newImport);
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated Prisma import in: ${fullPath}`);
      }
    }
  });
}

updateImports(directory);
console.log('✅ Prisma imports updated.');
