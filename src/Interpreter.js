
class Interpreter {
    constructor(){
        this.Main = new Switch("Main", undefined);
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
                                this._matcher = (div) => {
                                    return div.cont == this.match;
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