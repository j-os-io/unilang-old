
module.exports = {
    CMul: { // concept in progress...
        get (){
            return require('./CMul/');
        }
    },
    HTML: {
        get(){
            return require('./HTML.js');
        }
    },
    CPP: {
        get(){
            return require('./CPP.js');
        }
    }
}