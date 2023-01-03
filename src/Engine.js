
const Interpreter = require('./Interpreter');
const Decanter = require('./Decanter');
const Languages = require('./Languages');

class Engine {
    constructor(){
        this.Languages = Languages;

        this.Decanter = new Decanter();
        this.Interpreter = new Interpreter(this);
    }

    SetLanguage(language){
        language(this);
    }
}

module.exports = Engine;