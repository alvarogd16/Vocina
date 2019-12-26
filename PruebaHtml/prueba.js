const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 3000

//const Gpio = require('onoff').Gpio
//const pinLED = new Gpio(4, 'out')

const server = http.createServer(function(req, res){
    /*Para poder leer distintos tipos de archivos*/
    var filePath = '.' + req.url
    if (filePath == './')
        filePath = './index.html'

    //console.log("Serving " + filePath)

    const ext = path.extname(filePath)
    var contentType = 'application/octet-stream'

    switch (ext) {
        case '.css':
            contentType = 'text/css'
            break
        case '.html':
            contentType = 'text/html'
            break
        case '.js':
            contentType = 'text/javascript'
            break
    }

    /*Lee el html*/
    fs.readFile(filePath, function(err, data){
        if(err){
            res.writeHead(404)
            res.write("Error: File Not Found")
        } else{
            res.writeHead(200, { 'Content-Type' : contentType })
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, function(err){
    if(err){
        console.log("Something went wrong", err)
    } else{
        console.log("Server is listening")
    }
})

