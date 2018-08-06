module.exports = {
  globals: {
    FB: true,
  },
  root: true,
  'extends': 'eslint-config-react-app',
  'plugins': [
    'flowtype'
  ],
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'flowtype/no-primitive-constructor-types': 1,
    'flowtype/no-types-missing-file-annotation': 1,
    'flowtype/no-weak-types': 1,
    'flowtype/require-parameter-type': 1,
    'flowtype/require-valid-file-annotation': 1,
  },
};
