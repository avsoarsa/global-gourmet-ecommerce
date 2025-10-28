require('dotenv').config(); require('child_process').execSync('npx ts-node prisma/seed.ts', {stdio: 'inherit'});
