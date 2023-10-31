const fs = require("fs");
const util = require('util')

const Unilang = require('../../index.js')

let engine = new Unilang()
engine.SetLanguage(engine.Languages.HTML.get())

let test = fs.readFileSync(__dirname + "/test.html").toString()

let divs = engine.Decanter.ReadChars(test)
let tags = engine.Interpreter.ReadDividends(divs)

console.log("tags:")
engine.Interpreter.LogTags(tags);