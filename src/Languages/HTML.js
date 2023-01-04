const Interpreter = require('../Interpreter');

module.exports = function(engine){
    engine.Decanter.DictAddStringSupport();

    let Interpreter = engine.Interpreter;

    let sComment = Interpreter.Main.NewSwitch('comment', '<!--')
    let sCommentEnd = sComment.NewSwitch('end', '-->').end()

    let sTag = Interpreter.Main.NewSwitch('tag', '<')
    let sTagDefine = sTag.NewSwitch('define', '!')
    let sTagEnd = sTag.NewSwitch('end', '/')
    let sTagClose = sTag.NewSwitch('close', '>').required()

    sTagClose.catch = function(tag, div){
        // Ok, fine, but now read the attributes
        let mainTag = tag._parent;
        let divs = mainTag.$IterateDivs();

        // Then close the tag
        if(Interpreter.tag.end || Interpreter.tag.define) {
            Interpreter.tag = Interpreter.tag._parent
        }

        Interpreter.Return()
    }
}

