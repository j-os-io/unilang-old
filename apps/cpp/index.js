const fs = require("fs");

const Unilang = require('../../index.js')

const projDir = "/Volumes/AirUSB/Sources/Experiments/Acid-master/Sources"
const file = projDir + "/Acid.hpp" //first testing

let engine = new Unilang()
engine.SetLanguage(engine.Languages.CPP.get())

let test = fs.readFileSync(file).toString()

let divs = engine.Decanter.ReadChars(test)
let tags = engine.Interpreter.ReadDividends(divs)

console.log("tags:", tags)