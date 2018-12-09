const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const pathMatch = require('path-match');
const app = next({
    dev,
    dir: './src'
});
const handle = app.getRequestHandler();
const {
    parse
} = require('url');

const PORT = process.env.PORT || 3000;
const APIRoutes = require('./server/api.js');

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
    // Public side
    server.use(express.static('public'))
    // Server-side
    const route = pathMatch();

    // server.get('/search', (req, res) => {
    //     return app.render(req, res, '/search', req.query);
    // });

    // server.get('/artist/:id', (req, res) => {
    //     const params = route('/artist/:id')(parse(req.url).pathname);
    //     return app.render(req, res, '/artist', params);
    // });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    /* eslint-disable no-console */
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server ready on http://localhost:${PORT}`);
    });
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
});