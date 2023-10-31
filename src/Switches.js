
let Utils = {}

Utils.MergeDivsArray = function(divs){
    if(divs.length > 0){
        let ret = {cont: '', start: divs[0].start, end: divs[0].end}

        for(var div of divs){
            ret.cont += div.cont
            ret.end = div.end
        }

        return ret
    }

    return false
}

class Switches {
    constructor(name){
        this.Name = name
        this.NumCycles = -1
        this.Events = {}
        this.Tokens = {}   
        this.Keywords = {} 
        this.Languages = {} 
        
        this.MergeKeyword = []
    }

    NewCycle(fun){
        this.NewCycleFun = fun
    }
    
    EndCycle(fun){
        this.CycleFun = fun
    }

    SetLang(l){
        let lang = this.Languages[l]

        if(lang){
            if(lang.firstCall)
                lang.firstCall()  

            if(lang.root && lang.root.firstCall)
                lang.root.firstCall()

            this.lang = lang
        }
        else {
            if(l == this.Name)
                this.lang = null 
            else
                console.error('Setted an inexisting language')
        }
    }

    Cycle(div=undefined){                
        if(!div && this.Divs){
            div = this.Divs[this.NumCycles++]
        }  

        if(this.lang){
            let lang = this.lang

            lang.NumCycles = this.NumCycles
            let res = lang.Cycle(div)     
            this.NumCycles = lang.NumCycles

            this.lastLang = this.lang

            return res
        }

        this.lastLang = this.lang

        if(!div)
            return

        if(this.NewCycleFun){
            if(this.NewCycleFun(div) === false)
                return;
        }

        let called = false

        for(let key in this.Keywords){
            let cont = ''
            let next = 0

            let divs = []

            while(cont.length < key.length){
                let d = this.Next(next++)
                if(d){
                    cont += d.cont
                    divs.push(d)
                }
                else 
                    break;
            }

            if(cont == key){
                let merge = divs[0] 
                
                if(divs.length > 1)
                    merge = Utils.MergeDivsArray(divs)

                let ret = this.Keywords[key](merge, next)
                called = true
                this.NumCycles += next-1

                if(ret === false)
                    return false;
            }
        }

        if (!called){
            if(this.Tokens[div.cont]){
                if(this.Tokens[div.cont](div) === false) return false;
                called = true
            }
            else if(!div.dict){
                if(this.SpecialCase){
                    this.SpecialCase(div)
                    called = true
                }
            }
            else {
                if(this.Events[div.dict.val]){
                    if(this.Events[div.dict.val](div) === false) return false;
                    called = true
                }
                else if(div.dict.path){
                    for(var e in this.Events){
                        if(div.dict.path.startsWith(e)){
                            if(this.Events[e](div) === false) return false;
                            called = true
                        }
                    }                
            
                }
            }
        }

        if(this.root){
            this.root.NumCycles = this.NumCycles
            let res = this.root.Cycle(div)
            if(res !== -1) return res
        }

        if(!called && this.Others){
            this.Others(div)
        }

        if(this.CycleFun)
            this.CycleFun(div, called)    
            
        return called ? true : -1
    }

    EnableReplay(divs){
        this.Divs = divs

        if(this.root)
            this.root.EnableReplay(divs)  
            
        for(let lang in this.Languages)
            this.Languages[lang].EnableReplay(divs)
    }

    Next(by=1){    
        let i = this.NumCycles+by-1
        
        if(i < 0 || !this.Divs || this.Divs.length < i)
            return undefined;
        
        return this.Divs[i];
    }

    AddInternalLanguage(switches){
        switches.Divs = this.Divs;        
        this.Languages[switches.Name] = switches
    }

    MergeDivs(count, from=false){  
        if(this.Divs.length == 0)
            return false;

        if(from==false)
            from = this.NumCycles - 1
        
        let ret = {cont: '', start: this.Divs[0].start, end: this.Divs[0].end}

        for(var d=0; d<count; d++){
            let div = this.Divs[d+from]
            ret.cont += div.cont
            ret.end = div.end
        }

        return ret        
    }
}

module.exports = Switches