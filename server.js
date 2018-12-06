const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev,
    dir: './src'
})
const routes = require('./src/routes')
const handle = routes.getRequestHandler(app)

app.prepare()
    .then(() => {
        const server = express()
        server.use(express.static('public'))
        
        server.get('/api/getList', (req, res) => {
            var list = ["item1", "item2", "item3"];
            res.json(list);
            console.log('Sent list of items');
        });
        
        server.get('/dashboard', (req, res) => {
            app.render(req, res, '/dashboard', req.params)
        })

        server.get('/score', (req, res) => {
            app.render(req, res, '/score', req.params)
        })
        
        server.get('/domain', (req, res) => {
            app.render(req, res, '/domain', req.params)
        })

        server.get('/domain/:domain/:subdomain', (req, res) => {
          const actualPage = '/resultDomain'
          const queryParams = {
              domain: req.params.domain,
              subdomain: req.params.subdomain
          }
          app.render(req, res, actualPage, queryParams)
        })
        
        server.get('/web', (req, res) => {
          app.render(req, res, '/web', req.params)
        })

        server.use(handle).listen(9000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:9000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })