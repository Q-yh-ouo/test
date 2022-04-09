const path = require("path")
const fs = require("fs-extra");
const shelljs = require("shelljs");

let rootPath = path.join(__dirname, "../");
let docPath = path.join(rootPath, "./docs");
let sourceReadmePath = path.join(rootPath, "./README.md");
let targetReadmePath = path.join(docPath, "./README.md");

console.log('====== Copy README.md Start ======')
fs.ensureFileSync(sourceReadmePath);
fs.ensureDirSync(docPath)
fs.copySync(sourceReadmePath, targetReadmePath)
console.log('====== Copy README.md End ======')

console.log('====== Docs generate ======')
shelljs.exec("vuese gen")
