
class Decanter {
    constructor(){
        this.dict = {
            alphaNumeric:{
                alpha:{
                    upper:['a','z'],
                    lower:['A', 'Z']
                },
                number:['0','9']
            },
            space : [-1, ' ', '\t']
        };

        this.dividends = [];
    }
    
    Match(ch, dict, parent=undefined, name=undefined){
        /// Define fixed properties
        if(dict.$ === undefined){
            let $ = dict.$ = {
                parent,
                name
            }

            switch(typeof dict){
                case 'object':
                    $.type = 1;
                    break;

                case 'array':
                    $.type = 2;

                    if((dict.length > 0 && dict.length <= 2) && dict[0] !== -1){
                        if(typeof dict[0] == 'string' && dict[0].length == 1){
                            $.tArr = '><'
                        }
                    }
                    else if(dict[0] === -1){
                        dict.slice(0, 1);
                    }

                    break;

                default:
                    $.type = 0;
            }

            delete dict.$parent;
        }

        /// Elaborate winner function
        function winner(){
            let tree = [];
            let path = ''
            let cDict = dict;
            while(cDict){
                let name = cDict.$.name
                if(name){
                    tree.push(name);
                    path += name + '.'
                }

                cDict = dict.$.parent;
            }

            path = path.substring(0, path.length-1)

            return {
                path,
                tree,
                dict,
                ch
            }
        }

        /// Elaborate dict
        let $ = dict.$;
        
        if($.type == 1){ // object
            for(let p in dict){
                let res = this.Match(ch, dict[p], dict, p);
                if(res) return res
            }
        }
        else if($.type == 2){ // array
            // is a range
            if(dict.$.tArr == '><'){
                if(ch >= dict[0] && ch <= dict[1]){
                    return winner()
                }
            }
            else { // is a normal list
                for(let p in dict){
                    let res = this.Match(ch, dict[p], dict, p);
                    if(res) return res
                }
            }
        }

        return false
    }
    
    ReadChars(str){
        let div = this.newDiv();

        let prevWin = null
        for(let c=0; c<str.length; c++){
            let ch = str.charAt(c);

            //div let's go!
            let win = this.Match(ch, this.dict)

            if(!this.cmpDiv(win, prevWin)){
                div = this.newDiv()
                div.start = c
            }

            div.end = c
            div.dividend += ch
        }
    }

    newDiv(){
        let div = new Dividend();
        this.dividends.push(div);
        return div;
    }

    cmpDiv(d1, d2){
        return ((!d1 || !d2) && d1 == d2) || d1.path == d2.path
    }
}

class Dividend {
    constructor(){
        this.dividend = '';

        this.start = 0;
        this.end = undefined;
    }
}

module.exports = Decanter;