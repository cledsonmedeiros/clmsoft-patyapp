module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-console": "off",
    "max-len": "off",
    "quotes": "off",
    "quote-props": "off",
    "no-underscore-dangle": "off",
    "no-dupe-keys": "off",
    "no-undef": "off",
  },
};