const fs = require("fs");

const Unilang = require('../../index.js')

const projDir = "/Volumes/AirUSB/Sources/Experiments/Acid-master/Sources"

let engine = new Unilang()
engine.SetLanguage(engine.Languages.HTML.get())

let test = fs.readFileSync("/Users/riccardo/Sources/GitHub/GentleMail/templates/It's time to move on to your Mac's next interface.html").toString()

let divs = engine.Decanter.ReadChars(test)
let tags = engine.Interpreter.ReadDividends(divs)

console.log("tags:", tags)