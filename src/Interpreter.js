
class Interpreter {
    constructor(){
        this.Main = new Switch("Main", undefined);
    }

    ReadDividends(divs){
        this.workingSwitch = this.Main
        let root = this.tag = new Tag()

        for(let d in divs){
            let div = divs[d]

            for(let sw of this.workingSwitch.switches){
                if(sw.CheckMatch(div)){

                    let thisTag = tag.$Insert(new Tag(sw));

                    if(sw.switches.length > 0) {
                        this.workingSwitch = sw
                        this.tag = thisTag
                    }
                }
            }
        }

        return root
    }
}

class Switch {
    constructor(name, match, parent=undefined) {
        this.name = name;
        this.requires = [];
        this.switches = [];
        this.match = match;
        this.parent = parent;

        this.dividends = [];
    }

    NewSwitch(name, match=''){
        let sw = new Switch(name, match, this)
        this.switches.push(sw)
        return sw
    }

    CheckMatch(div){
        if(!this._matcher) {
            switch (typeof this.match) {
                case 'string':
                    if (this.match.length > 0) {
                        switch(this.match[0]){
                            default:
                                this._matcher = () => {
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

        this._matcher();
    }
}

class Tag {
    constructor(sw = undefined){
        this._i = 0
        this._d = []

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

        return val
    }
}

module.exports = Interpreter;