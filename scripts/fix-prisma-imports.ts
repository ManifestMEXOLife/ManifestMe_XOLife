// scripts/fix-prisma-imports.ts
import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '../src');
const PRISMA_CONFIG = path.resolve(ROOT_DIR, 'prisma.config.ts');

function getAllFiles(dir: string, ext: string[] = ['.ts', '.js']): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (ext.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getAllFiles(ROOT_DIR);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes(`from '@prisma/client'`)) {
    const relativePath = path.relative(path.dirname(file), PRISMA_CONFIG).replace(/\\/g, '/');
    content = content.replace(
      /import\s+\{\s*PrismaClient\s*\}\s+from\s+['"]@prisma\/client['"]/g,
      `import prisma from './${relativePath}'`
    );
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated Prisma import in ${file}`);
  }
});

console.log('All Prisma imports updated.');
