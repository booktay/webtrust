const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

var http = require('http');
var https = require('https');
var fs = require('fs');
var privateKey = fs.readFileSync('./server/sslcert/localhost.key', 'utf8');
var certificate = fs.readFileSync('./server/sslcert/localhost.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const pathMatch = require('path-match');
const app = next({
    dev,
    dir: './src'
});
const routes = require('./src/Routes')
const handle = routes.getRequestHandler(app)

const {
    parse
} = require('url');

const PORT = process.env.PORT || 3000;
const APIRoutes = require('./server/api.js');
const TestRoutes = require('./server/test.js');

app.prepare().then(() => {
    const server = express();

    server.use(bodyParser.json());
    server.use(session({
        secret: 'super-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000
        }
    }));

    // API Route
    server.use('/api', APIRoutes);
    // Test Route
    server.use('/test', TestRoutes);
    // Public side
    server.use(express.static('./public'))
    // Server-side
    const route = pathMatch();

    server.get('/', (req, res) => {
        return app.render(req, res, '/');
    });
    server.get('/rule', (req, res) => {
        return app.render(req, res, '/rule');
    });
    // Domain
    server.get('/domain/:domain/:subdomain', (req, res) => {
        const params = route('/domain/:domain/:subdomain')(parse(req.url).pathname);
        return app.render(req, res, '/domain', params);
    });
    // Score
    server.get('/testscore/:url', (req, res) => {
        const params = route('/testscore/:url')(parse(req.url).pathname);
        return app.render(req, res, '/testscore', params);
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    /* eslint-disable no-console */
    // server.listen(PORT, (err) => {
    //     if (err) throw err;
    //     console.log(`Server ready on http://localhost:${PORT}`);
    // });

    var httpServer = http.createServer(server);
    httpServer.listen(8080);
    var httpsServer = https.createServer(credentials, server);
    httpsServer.listen(8443);
    
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
});