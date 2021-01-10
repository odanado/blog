// @ts-check

/** @type {import('@acot/types').Config} */
module.exports = {
  extends: ['@acot'],
  connection: {
    command: 'yarn http-server dist'
  },
  origin: 'http://localhost:8080',
  paths: ['/']
};
