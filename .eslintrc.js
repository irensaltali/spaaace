module.exports = {
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2022,
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "node": true,
        "es2022": true
    },
    "rules": {
        "arrow-parens": "off",
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "comma-dangle": "off",
        "guard-for-in": "off",
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "max-len": "off",
        "max-statements-per-line": ["error", { "max": 2 }],
        "no-console": "off",
        "no-warning-comments": "off",
        "object-curly-spacing": ["error", "always"],
        "space-before-blocks": 0,
        "padded-blocks": "off",
        "require-jsdoc": "off",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    },
    "globals": {
        "window": true,
        "document": true,
        "navigator": true,
        "Howl": true,
        "location": true,
        "PIXI": true
    }
};
