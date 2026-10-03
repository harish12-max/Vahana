const readline = require('node:readline');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDatabase = require('../src/config/database');
const User = require('../src/models/user.model');
const { USER_ROLES } = User;

const ask = (prompt) => new Promise((resolve) => {
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  terminal.question(prompt, (answer) => {
    terminal.close();
    resolve(answer);
  });
});

const askPassword = () => new Promise((resolve, reject) => {
  if (!process.stdin.isTTY) {
    reject(new Error('Password entry requires an interactive terminal.'));
    return;
  }

  let password = '';
  process.stdout.write('Password: ');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  const finish = (error) => {
    process.stdin.removeListener('data', onData);
    process.stdin.setRawMode(false);
    process.stdout.write('\n');

    if (error) {
      reject(error);
      return;
    }

    resolve(password);
  };

  const onData = (chunk) => {
    for (const character of chunk.toString()) {
      if (character === '\u0003') {
        finish(new Error('Admin creation cancelled.'));
        return;
      }

      if (character === '\r' || character === '\n') {
        finish();
        return;
      }

      if (character === '\b' || character === '\u007f') {
        password = password.slice(0, -1);
        continue;
      }

      password += character;
    }
  };

  process.stdin.on('data', onData);
});

const createAdmin = async () => {
  const name = (await ask('Admin name: ')).trim();
  const email = (await ask('Admin email: ')).trim().toLowerCase();
  const mobileNumber = (await ask('Admin mobile number (+91XXXXXXXXXX): ')).trim();
  const password = await askPassword();

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    name,
    email,
    mobileNumber,
    passwordHash,
    role: USER_ROLES.ADMIN,
    accountStatus: 'ACTIVE',
    isEmailVerified: true,
    isMobileVerified: true,
  });

  console.log(`Admin account created for ${email}.`);
};

const main = async () => {
  try {
    await createAdmin();
  } catch (error) {
    if (error.code === 11000) {
      console.error('An account with the provided email or mobile number already exists.');
    } else if (error.name === 'ValidationError' || error.message === 'Password must be at least 8 characters long.') {
      console.error(error.message === 'Password must be at least 8 characters long.' ? error.message : 'Invalid admin details.');
    } else if (error.message === 'Admin creation cancelled.' || error.message === 'Password entry requires an interactive terminal.') {
      console.error(error.message);
    } else {
      console.error('Unable to create the admin account.');
    }

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

main();
