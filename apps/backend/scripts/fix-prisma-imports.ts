// scripts/fix-prisma-imports.ts
import fs from 'fs';
import path from 'path';

function getRelativePrismaPath(filePath: string) {
  const depth = filePath.split(path.sep).length - 2; // adjust if needed
  return `${'../'.repeat(depth)}prisma.config`;
}

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = content.replace(
    /import { PrismaClient } from ['"]@prisma\/client['"];?/g,
    `import prisma from '${getRelativePrismaPath(filePath)}';`
  );
  fs.writeFileSync(filePath, newContent);
  console.log(`Updated imports in: ${filePath}`);
}

function walkDir(dir: string) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(ts|js)$/.test(fullPath)) {
      processFile(fullPath);
    }
  });
}

walkDir('src'); // scan all files in src/
console.log('All Prisma imports updated.');
