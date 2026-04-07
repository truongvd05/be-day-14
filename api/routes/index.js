const express = require("express");
const { readdirSync } = require("fs");
const path = require("path");

const router = express.Router();

const postfix = ".router.js";

const files = readdirSync(__dirname).filter((_name) => _name.endsWith(postfix));

for (const fileName of files) {
    const resource = fileName.replace(postfix, "");
    const module = require(`./${fileName}`);
    router.use(`/${resource}`, module.default || module);
}

module.exports = router;
