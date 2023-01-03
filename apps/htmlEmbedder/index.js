const fs = require("fs");

const Unilang = require('../../index.js')

let engine = new Unilang()
engine.SetLanguage(engine.Languages.HTML.get())

let test = fs.readFileSync("/Users/riccardo/Sources/GitHub/GentleMail/templates/It's time to move on to your Mac's next interface.html").toString()

let read = engine.Decanter.ReadChars(test)

console.log("read", engine.Decanter.dividends)