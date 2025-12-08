// migrate-prisma7.ts
import fs from 'fs';
import path from 'path';

const directory = path.join(process.cwd(), 'src'); // change if needed
const prismaConfigImport = `import prisma from './prisma.config';`;

function migratePrisma(dir: string) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      migratePrisma(fullPath);
    } else if (/\.(ts|js)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let modified = false;

      // Replace PrismaClient imports
      const importRegex = /import\s*{\s*PrismaClient\s*}\s*from\s*['"]@prisma\/client['"];?/g;
      if (importRegex.test(content)) {
        content = content.replace(importRegex, prismaConfigImport);
        modified = true;
      }

      // Replace `new PrismaClient()` instances
      const newInstanceRegex = /new\s+PrismaClient\s*\(\s*\)/g;
      if (newInstanceRegex.test(content)) {
        content = content.replace(newInstanceRegex, 'prisma');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`✅ Updated Prisma usage in: ${fullPath}`);
      }
    }
  });
}

migratePrisma(directory);
console.log('✅ Prisma migration completed.');
