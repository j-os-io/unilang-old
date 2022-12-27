const Unilang = require('../../index.js')

let engine = new Unilang()
engine.Decanter.DictAddStringSupport();

let test = 'ciao.come(va, "io bene, grazie!")'
let read = engine.Decanter.ReadChars(test)
console.log("read", engine.Decanter.dividends)