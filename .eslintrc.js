// https://blog.csdn.net/ivenqin/article/details/104673237/ eslint规则大全
module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "amd": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": "error",
        'generator-star-spacing': 'off',
        "global-require": 0,
        "no-unused-vars": "off",
    }
};
