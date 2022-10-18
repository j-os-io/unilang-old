
class Decanter {
    constructor(){
        this.dict = {
            alphaNumeric:{
                alpha:{
                    upper:['a','z'],
                    lower:['A', 'Z']
                },
                number:['0','9']
            }
        };

        this.dividends = [];
    }
    
    Match(ch, dict, parent=undefined){
        /// Define fixed properties
        if(!dict.$){
            let $ = dict.$ = {
                parent            
            }

            switch(typeof dict){
                case 'object':
                    $.type = 1;
                    break;

                case 'array':
                    $.type = 2;
                    break;

                default:
                    $.type = 0;
            }

            delete dict.$parent;
        }

        /// Elaborate dict
        let $ = dict.$;
        
        if($.type == 1){ // object
            for(let p in dict){
                this.Match(ch, dict[p], dict);
            }
        }
        else if($.type == 2){ // array
            //todo
        }
    }
    
    Read(str){
        let div = new Dividend();

        for(let c=0; c<str.length; c++){
            let ch = str.charAt(c);

            //div let's go!  
            // continue here..
            this.Match(ch, this.dict);
        }
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