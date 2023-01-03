
class Interpreter {
    constructor(Engine){
        this.Engine = Engine

        this.Main = new Switch("Main", undefined);
        this.Main._int = this;
    }

    ReadDividends(divs){
        this.workingSwitch = this.Main
        let root = this.tag = new Tag(this.Main)

        for(let d in divs){
            let div = divs[d]

            let newSwitch = false

            for(let sw of this.workingSwitch.switches){
                if(sw.CheckMatch(div)){
                    newSwitch = true
                    let thisTag = new Tag(sw)

                    if(sw.switches.length > 0) {
                        this.tag.$Insert(thisTag);
                        this.workingSwitch = sw
                        this.tag = thisTag
                    }
                    else {
                        this.tag.$Insert(thisTag, sw.name);
                    }

                    thisTag.$dividends.push(div)

                    if(sw.catch)
                        sw.catch(thisTag, div)

                    break;
                }
            }

            if(!newSwitch)
                this.tag.$dividends.push(div)
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
                                            this._iDiv++;
                                            return this._iDiv == divsMatch.length;
                                        }
                                        else{
                                            if(this._iDiv > 0)
                                                this._iDiv = 0;
                                            else
                                                return false;
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
            this._int.tag = tag._parent
            this._int.Return()
        }
        return this
    }

}

class Tag {
    constructor(sw = undefined){
        this._i = 0
        this._d = []

        this.$dividends = [];

        if(sw){
            this.$Insert(sw.name, "$name") // only for debug purposes, for the moment
            this.$Insert(sw, "$switch")
        }
    }

    $Insert(val, i=-1){
        if(i==-1)
            i = this._i++
        else
            this._d.push(i)

        this[i] = val

        if(val instanceof Tag)
            val._parent = this

        return val
    }
}

module.exports = Interpreter;