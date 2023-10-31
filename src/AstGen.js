
class AstGen {

    constructor(opt){
        this.Children = []
        this.Divs = []
        this.Attributes = {}

        this.opt = opt
    }

    AddChild(){
        let ast = this.CreateChild()
        this.AddReference()
        this.Children.push(ast)
        return ast
    }

    CreateChild(){
        let ast = new AstGen()
        ast.parent = this 
        ast.opt = this.opt
        return ast
    }

    IndexOf(what, from=0){
        for(let i=from; i<this.Divs.length; i++){
            let div = this.Divs[i];
            if(div.dict && div.dict.path && div.dict.path.startsWith(what) || div.cont == what)
                return i;
        }

        return -1;
    }

    ValueOf(divNum = 0){
        if(divNum >= this.Divs.length)
            return undefined;

        return this.Divs[divNum]
    }

    CountKeywords(){
        let c = 0
        for(let div of this.Divs){
            if(this.opt.divisors.indexOf(div.cont) == -1)
                c++
        }

        return c
    }

    ValueOfKeyword(divNum = 0){
        let c = 0

        for(let div of this.Divs){
            if(this.opt.divisors.indexOf(div.cont) == -1){
                if(c++ == divNum)
                    return div.cont
            }
        }

        return undefined
    }

    PushDiv(val, at=-1){
        if(at == -1)
            at = this.Divs.length

        this.Divs.splice(at, 0, {cont: val});
    }

    RecoverUntilNewLine(){
        let pDivs = this.parent.Divs;
        for(let i = pDivs.length-2; i>=0; i--){

            if(pDivs[i].cont == '\n'){
                return;
            }
            
            this.Divs.splice(0, 0, pDivs[i]);
            pDivs.splice(i,1)
        }
    }    

    AddReference(alreadyAdded = false){
        this.Divs.push({ref: this.Children.length - (alreadyAdded ? 1 : 0), type:'$ref'})
    }

    ToString(opts={}){
        let res = ''

        let o = opts[this.type] || {}

        if(o.start) res += o.start

        for(let div of this.Divs){
            if(div.ref !== undefined)
                res += this.Children[div.ref].ToString(opts)
            else
                res += div.cont
        }

        if(o.end) res += o.end

        return res
    }

    IsEmpty(){
        let isEmpty = true 

        if(this.Children.length > 0)
            return false

        for(let div of this.Divs){
            if(div.cont || (div.dict && div.dict.val != ' '))
                isEmpty = false
            
        }

        return isEmpty
    }

    GetFirstChild(){
        for(let child of this.Children){
            if(!child.IsEmpty())
                return child
        }

        return undefined
    }

    GetChildByType(type){
        for(let child of this.Children){
            if(child.type == type)
                return child
        }

        return undefined
    }

    GetDiv(where, index=0){        
        let wi = 0, i = 0

        for(let div of this.Divs){
            let valid = false
            for(let w in where){
                if(w == '$dict'){
                    if(div.dict && div.dict.val == where[w]){
                        valid = true
                        break;
                    }
                }
                else if(div[w] == where[w]){
                    valid = true 
                    break;
                }
            }

            if(valid){
                if(index == wi++)
                    return { div, wi, i }
            }

            i++
        }
    }
}

module.exports = AstGen