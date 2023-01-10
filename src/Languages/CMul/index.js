// CMultiplied Aka C* (no geographic references...)

module.exports = function(engine){
    engine.Decanter.DictAddStringSupport();

    let Interpreter = engine.Interpreter;

    Interpreter.Main.default = 'expression'; //TODO: by default, if any switch is declared, works as expression

    let sDirective = Interpreter.Main.NewSwitch('directive', '#')
    let sNewLine = sDirective.NewSwitch('newLine', '\n').end()


}