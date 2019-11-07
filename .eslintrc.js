module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
    ],
    "globals": {
        "resources": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "rules": {
        "no-undef": "off",
        "no-unused-vars": "off",
        "semi": ["error", "always"],
        "eqeqeq": "error",
        "block-scoped-var": "error",
        "consistent-return": "error",
        "no-eq-null": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-self-compare": "error",
        "no-unused-expressions": "error",
        "curly": "error",
        "max-len": "off",//["error", {"code": 100, "ignoreComments": true}],
        "max-lines-per-function": "off"//["error", {"max": 90}]
    },
    "plugins": [],
    "settings": {}
};
