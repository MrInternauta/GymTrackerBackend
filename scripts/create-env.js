/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

fs.writeFile('./.env', `API=${process.env.API}\n`, err => {
  if (err) {
    console.log(err);
  }

  console.log(`.env wrote! ${JSON.stringify(process.env)}`);
});
