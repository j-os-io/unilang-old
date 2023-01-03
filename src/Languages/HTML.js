const Interpreter = require('../Interpreter');

module.exports = function(engine){
    engine.Decanter.DictAddStringSupport();

    let Interpreter = engine.Interpreter;

    let sComment = Interpreter.Main.NewSwitch('comment', '<!--')
    let sCommentEnd = sComment.NewSwitch('end', '-->').end()

    let sTag = Interpreter.Main.NewSwitch('tag', '<')
    let sTagEnd = sTag.NewSwitch('end', '/')
    let sTagClose = sTag.NewSwitch('close', '>')

    sTagClose.catch = function(tag, div){
        if(tag.end) {
            Interpreter.tag = tag._parent
        }

        Interpreter.Return()
    }
}

