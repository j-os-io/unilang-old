
const Interpreter = require('./Interpreter');
const Decanter = require('./Decanter');

class Engine {
    constructor(){
        this.Decanter = new Decanter();
        this.Interpreter = new Interpreter();
    }
}

module.exports = Engine;