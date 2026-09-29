// Script untuk generate password hash admin
// Jalankan: node scripts/generate-hash.js
const bcrypt = require('bcryptjs');

const password = 'admin123'; // Ganti dengan password yang diinginkan
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('='.repeat(50));
  console.log('Password Hash Generator - PT AKN');
  console.log('='.repeat(50));
  console.log(`Password : ${password}`);
  console.log(`Hash     : ${hash}`);
  console.log('='.repeat(50));
  console.log('\nGunakan hash di atas untuk UPDATE SQL:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@ptakn.co.id';`);
});
