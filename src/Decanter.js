
class Decanter {
    constructor(){
        this.dict = {
            // Special matches
            _groups: { },

            // Normal matches
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

        // Special variables
        this.curGroup = undefined;
    }

    DictAddStringSupport(){
        let groups = this.dict._groups = this.dict._groups || {};
        let string = groups.string = this.string || [];

        string.push({
            delimiter: '"',
            exception: '\\'
        });
    }
    
    Match(ch, dict, parent=undefined, name=undefined){
        /// Define fixed properties
        if(dict.$ === undefined){

            let typeDict = typeof dict
            if(typeDict == 'object'){
                if(Array.isArray(dict))
                    typeDict = 'array'

                let $ = dict.$ = {
                    parent,
                    name
                }

                // Check if it's a child of a special match
                var p = parent;
                while(p){
                    if(p.$.special){
                        $.specialType = p.$.name.substring(1);
                        break;
                    }

                    p = p.$.parent;
                }

                // Special match
                if(name && name[0]=='_'){
                    $.special = true
                }

                switch(typeDict){
                    case 'object':
                        $.type = 1;
                        break;

                    case 'array':
                        $.type = 2;

                        if(dict.length > 0){
                            if(dict.length <= 2 && dict[0] !== -1){
                                if(typeof dict[0] == 'string' && dict[0].length == 1){
                                    $.tArr = '><'
                                }
                            }
                            else {
                                if(dict[0] === -1){
                                    dict.slice(0, 1);
                                }

                                $.tArr = '..'
                            }
                        }

                        break;

                    default:
                        $.type = 0;
                        break;
                }
                
            }
        }

        /// Elaborate winner function
        function winner(val = undefined){
            let tree = [];
            let path = ''
            let cDict = dict;
            let lastName = undefined

            while(cDict){
                let name = cDict.$.name
                if(name){
                    tree.push(name);
                    path = name + '.' + path
                    lastName = name
                }

                cDict = cDict.$.parent;
            }

            if(val){
                path += val
                tree.push(val)
            }
            else {
                path = path.substring(0, path.length-1)
                val = lastName
            }

            return {
                path,
                tree,
                dict,
                ch,
                val
            }
        }

        /// Elaborate dict
        let $ = dict.$;

        if(!$){
            console.error("it shouldn't arrive here 26345", dict)
        }
        else if($.type == 1){
            switch($.specialType){
                case 'groups':
                    if(dict.$._exception){
                        dict.$._exception = false;
                    }
                    else if(ch == dict.delimiter){
                        if(this.curGroup != dict){
                            this.curGroup = dict;
                            return winner();
                        }
                        else {
                            this.curGroup = undefined;
                        }                        
                    }
                    else if(ch == dict.exception){
                        dict.$._exception = true;
                    }

                    return this.curGroup;

                default: 
                    for(let p in dict){
                        if(p != '$'){
                            let res = this.Match(ch, dict[p], dict, p);
                            if(res) return res
                        }
                    }
                    break;
            }
        }
        else if($.type == 2){ // array
            if($.specialType){
                for(let p in dict){
                    if(p != '$') {
                        let res = this.Match(ch, dict[p], dict, p);
                        if (res) return res
                    }
                }
            }
            else {
                if ($.tArr == '><') { // is a range
                    if (ch >= dict[0] && ch <= dict[1]) {
                        return winner()
                    }
                } else if ($.tArr == '..') { // is one of them
                    for (var val of dict) {
                        if (ch == val) {
                            return winner(val)
                        }
                    }
                } else { // is a normal list
                    console.log("currently unsupported 35462", dict)
                    return; //todo: behave like special array
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
            let win = undefined;
            if(this.curGroup){
                win = this.Match(ch, this.curGroup)
            }
            else {
                win = this.Match(ch, this.dict)
            }

            if(!this.cmpDiv(win, prevWin)){
                div = this.newDiv()
                div.start = c
                div.dict = win
            }

            div.end = c
            div.cont += ch

            prevWin = win
        }

        return this.dividends
    }

    newDiv(){
        let div = new Dividend();
        this.dividends.push(div);
        return div;
    }

    cmpDiv(d1, d2){
        return d1 && d2 && (d1 == d2 || d1.path == d2.path)
    }
}

class Dividend {
    constructor(){
        this.cont = '';

        this.start = 0;
        this.end = undefined;
    }
}

module.exports = Decanter;