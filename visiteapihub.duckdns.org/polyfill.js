if (typeof global !== 'undefined' && !global.crypto) {
  const crypto = require('crypto');
  global.crypto = crypto;
}
