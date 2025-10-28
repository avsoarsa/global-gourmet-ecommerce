require('dotenv').config(); require('child_process').execSync('npx prisma db pull', {stdio: 'inherit'});
