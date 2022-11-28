const Unilang = require('../../index.js')

let engine = new Unilang()
let test = "ciao.come(va)"
let read = engine.Decanter.ReadChars(test)
console.log("read", engine.Decanter.dividends)