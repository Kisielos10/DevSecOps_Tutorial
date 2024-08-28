const globals = require('globals');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      "space-infix-ops": ["error", { "int32Hint": false }],
      "no-undef": "error",
      "no-unused-vars": "warn"
    }
  }
];