
module.exports = function(engine){
    engine.Decanter.DictAddStringSupport();

    let Interpreter = engine.Interpreter;

    let sDirective = Interpreter.Main.NewSwitch('directive', '#')
    let sNewLine = sDirective.NewSwitch('newLine', '\n')


}

