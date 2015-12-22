var winston = require('winston');

// this function just configure logger from `winston` module and return it.
function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');  // get path to module file

    return new winston.Logger({
       transports: [                            // return new winston logger which is
           new winston.transports.Console({     // connected to the console,
               colorize: true,                  // has colorized text,
               level: 'debug',                  // print everything since `debug` level
               label: path                      // and prints path to module file
           })
       ]
    });
}

module.exports = getLogger;