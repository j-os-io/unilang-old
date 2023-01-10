// CMultiplied Aka C* (no geographic references...)

module.exports = function(engine){
    engine.Decanter.DictAddStringSupport();

    let Interpreter = engine.Interpreter;

    Interpreter.Main.default = 'expression'; //todo

    let sDirective = Interpreter.Main.NewSwitch('directive', '#')
    let sNewLine = sDirective.NewSwitch('newLine', '\n').end()

    let sExpression = Interpreter.Main.NewSwitch('expression');
}