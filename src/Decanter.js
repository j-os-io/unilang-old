
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

    Match(){
        
    }
    
    Read(str){
        let div = new Dividend();

        for(let c=0; c<str.length; c++){
            let ch = str.charAt(c);

            //div let's go!  
            
        }
    }
}

class Dividend {
    constructor(){
        this.dividend = 'dunno';

        this.start = 0;
        this.end = undefined;
    }
}

module.exports = Decanter;