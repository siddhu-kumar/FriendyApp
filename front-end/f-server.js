const http = require('http')
const fs = require('node:fs')
const path = require('node:path')

const server = http.createServer(function (req, res) {
    if (req.url === '/') {
        const filepath = path.join(__dirname, '/public/html','index.html')
        serveFile(res, filepath)
    } else if(req.url.endsWith('.js') || req.url.endsWith('.css') || req.url.endsWith('.ico') ) {
        serveStaticFile(res, req.url)
    }else {
        const filepath = path.join(__dirname, '/public/html','pageNotExists.html')
        fs.readFile(filepath,(err,data) => {
            if(err) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain')
                res.end('Unsupported request')
                return;
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(data)
        })
    }
})

function serveStaticFile(res, filedirectory) {
    var filepath
    if (filedirectory.endsWith('.css')) {
        filepath = path.join(__dirname, '/public/style', filedirectory)
    }
    if (filedirectory.endsWith('.js')) {
        filepath = path.join(__dirname, '/public/js', filedirectory)
    }
    if (filedirectory.endsWith('.ico')) {
        res.end()
        return;
    }
    const contenttype = contentType(filedirectory)
    fs.readFile(filepath, (err, data) => {
        if (err) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            res.end('Unsupported request')
            return;
        }
        res.statusCode = 200
        res.setHeader('Content-Type', contenttype)
        res.end(data)
    })
}

function serveFile(res, filepath) {
    fs.readFile(filepath, (err, data) => {
        if (err) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            res.end('Unsupported request')
            return;
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end(data)
    })
}

function contentType(filedirectory) {
    if (filedirectory.endsWith('.js'))
        return 'application/javascript'
    else if (filedirectory.endsWith('.css'))
        return 'text/css'
    else
        return 'text/plain'
}
server.listen(3000, '0.0.0.0')