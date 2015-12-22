### Log module manual

This module uses to print different log/debug/error information to the console. It's replaces `console.log`, `console.error` etc functions. This module prints information in form shown below:

`<info level>: [<path to file where message came from>] <message>`

So with this module you know where message came from and how serious it is.
#### How to use it

This module is a wrapper around `winston` logging module. So you need:
1. Install `winston` module as `npm i winston --save`      
`--save` will automatically add `winston` into the project `package.json`
2. Include this module into yours like this:      
`var log = require(<path to log.js>)(module);`
3. Use it like this:    
`log.debug('some text');`   
`log.info('some text');`    
`log.warn('some text');`   
`log.error('some text');`   
#### PS
1. Please, use it instead of `console.log`.
2. All `console.log` have been replaced with `log.info`.
2. You can see more documentation about winston [here](https://www.npmjs.com/package/winston).