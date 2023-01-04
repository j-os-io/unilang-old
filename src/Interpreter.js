const Unilang = require("../index");

class Interpreter {
    constructor(Engine){
        this.Engine = Engine

        this.Main = new Switch("Main", undefined);
        this.Main._int = this;
    }

    ReadDividends(divs){
        this.workingSwitch = this.Main
        let root = this.tag = new Tag(this.Main)

        for(let d=0; d < divs.length; d++){
            let div = divs[d]

            let winnerSw = undefined

            this.workingSwitch.lines = [] // clear parallel lines
            for(let sw of this.workingSwitch.switches){
                sw.CheckMatch(div)
            }

            // Check for parallels lines
            let lines = [...this.workingSwitch.lines]
            if(lines.length > 0){
                for(let line of lines){
                    let dd = d
                    while(true){
                        let res = line.CheckMatch(divs[dd++])

                        if(res){
                            line._bestThrow = dd
                            break
                        }
                        else if(res === 0){
                            line._bestThrow = -1
                            break
                        }
                    }
                }
            }

            // The winner is the one which go far away
            winnerSw = lines[0]
            for(let line of lines){
                if(line._bestThrow > winnerSw._bestThrow)
                    winnerSw = line
            }

            // Handle winner switch
            if(winnerSw && winnerSw._bestThrow >= 0){
                let b = d // b stand for 'born'

                // Bring ahead the reader
                d = winnerSw._bestThrow-1;

                let thisTag = new Tag(winnerSw)

                if(winnerSw.switches.length > 0) {
                    this.tag.$Insert(thisTag);
                    this.workingSwitch = winnerSw
                    this.tag = thisTag
                }
                else {
                    this.tag.$Insert(thisTag, winnerSw.name);
                }

                // temporary solution for getting the activators dividends
                for(let dd=(d-winnerSw._iDiv)+1; dd<=d; dd++) {
                    thisTag.$initBy.push(divs[dd])
                    this.tag.$dividends.push(divs[dd])
                    divs[dd].init = true

                    //TODO: Inject to dividend the possibility to be implemented in a deeper tag
                    divs[dd].tag = thisTag
                }

                if(winnerSw.catch)
                    winnerSw.catch(thisTag, div)
            }
            else {
                this.tag.$dividends.push(div)
                div.tag = this.tag
            }
        }

        return root
    }

    Return(){
        this.workingSwitch = this.workingSwitch.parent
    }
}

class Switch {
    constructor(name, match, parent=undefined) {
        this.name = name;
        this.requires = [];
        this.switches = [];
        this.match = match;
        this.parent = parent;
        this.catch = undefined;

        this.lines = [];
    }

    NewSwitch(name, match=''){
        let sw = new Switch(name, match, this)
        sw._int = this._int
        this.switches.push(sw)
        return sw
    }

    CheckMatch(Dividend){
        if(!this._matcher) {
            switch (typeof this.match) {
                case 'string':
                    if (this.match.length > 0) {
                        switch(this.match[0]){
                            default:
                                let divsMatch = this._int.Engine.Decanter.ReadChars(this.match)
                                this._iDiv = 0
                                this._matcher = (div) => {
                                    while(true){
                                        if(this._iDiv >= divsMatch.length)
                                            this._iDiv = 0

                                        if(divsMatch[this._iDiv].cont == div.cont) {
                                            if(this._iDiv == 0)
                                                this.parent.lines.push(this)

                                            this._iDiv++;

                                            let end = this._iDiv == divsMatch.length;
                                            return end
                                        }
                                        else{
                                            /*let i = this.parent.lines.indexOf(this);
                                            if(i >= 0)
                                                this.parent.lines.splice(i, 1)*/

                                            if(this._iDiv > 0)
                                                this._iDiv = 0;
                                            else
                                                return 0;
                                        }

                                    }

                                    return true;
                                };
                        }
                    }

                    break;

                case 'function':
                    this._matcher = this.match
                    break;
            }

            if(!this._matcher){
                this._matcher = ()=>{
                    console.warn("No match found for this switch", this);
                }
            }
        }

        return this._matcher(Dividend);
    }

    ///
    /// Fast settings
    ///
    end(){
        this.catch = function(tag){
            this._int.tag = this._int.tag._parent
            this._int.Return()
        }
        return this
    }

    required(){
        this.parent.requires = this.name

        return this
    }

}

class Tag {
    constructor(sw = undefined){
        this._i = 0
        this._d = []

        this.$dividends = [];
        this.$initBy = []

        if(sw){
            this['$name'] = sw.name // only for debug purposes, for the moment
            this['$switch'] = sw
        }
    }

    $Insert(val, i=-1){
        if(i!=-1) {
            this._d.push(i)
            this[i] = val
        }
        else {
            this[this._i++] = val
        }

        if(val instanceof Tag)
            val._parent = this

        return val
    }

    $IterateDivs(){
        return new IterateDividends(this)
    }
}

class IterateDividends{
    constructor(tag){
        this.tag = tag
        this.divs = tag.$dividends
        this.i = 0
    }

    first(query){

    }
}

class IterateDiv {
    query(q) {
        let engine = new Unilang()
        let divs = engine.Decanter.ReadChars(q)

        for(let div of divs){
            //TODO: continue here
        }
    }
}

module.exports = Interpreter;