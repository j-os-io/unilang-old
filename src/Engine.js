
const Interpreter = require('./Interpreter');

class Engine {
    constructor(){
        this.Interpreter = new Interpreter();
    }
}

module.exports = Engine;