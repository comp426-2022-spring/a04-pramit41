var args = require('minimist')(process.argv.slice(2))

args['port'] 

const port = args.port || process.env.pot || 5555

const morgan = require('morgan')

if(args.help || args.h){
    console.log(`
    server.js [options]
    
    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
    
    --debug	If set to true, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                false.
    
    --log		If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
    
    --help	Return this message and exit.
    `)
    process.exit(0)
}

const logdb = require('./database')

const express = require('express')

const app = express()

app.get('/app/error', (req, res) => {
    throw new Error('Error test was successful') // Express will catch this on its own.
})

if (args.log){
    const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: WRITESTREAM }))
}

app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    next()
})

if (args.debug){
    app.get('/app/log/access', (req, res) =>{
        try{
            const stmt = db.prepare(`SELECT * from accesslog`).all()
            res.status(200).json(stmt)
        } catch (e){
            console.log(e)
        }
    })
}

app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
})
