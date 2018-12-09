const express = require('express')
const next = require('next')
const { parse } = require('url');
const getCSV = require('get-csv');

const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev,
    dir: './src'
})
const routes = require('./src/routes')
const handle = routes.getRequestHandler(app)
const PORT = process.env.PORT || 9000;

app.prepare()
    .then(() => {
        const server = express()
        // static folder
        server.use(express.static('public'))

        server.get('*', (req, res) => {
            const parsedUrl = parse(req.url, true);
            const {
                pathname,
                query = {}
            } = parsedUrl;
            const route = routes[pathname];
            if (route) {
                return app.render(req, res, route.page, query);
            }
            return handle(req, res);
        });

        // server.get('/api/score/:domain/:subdomain', (req, res) => {
        //     var results = []
        //     var PATHURL = 'http://localhost:9000/data/'+req.params.subdomain+'.'+req.params.domain+'.txt';
        //     getCSV(PATHURL, {
        //             headers: true
        //         }).then(rows =>
        //         res.send(rows)
        //     );
        // });
        
        // server.get('/domain/:domain/:subdomain', (req, res) => {
        //   const actualPage = '/resultDomain'
        //   const queryParams = {
        //       domain: req.params.domain,
        //       subdomain: req.params.subdomain
        //   }
        //   app.render(req, res, actualPage, queryParams)
        // })

        server.use(handle).listen(PORT, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${PORT}`)
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })