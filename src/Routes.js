const routes = require('next-routes')

module.exports = routes()   
.add({name:'index', pattern:'/', page:'Index'})
.add({name:'domain', pattern:'/domain/:domain/:subdomain', page:'domain'})
.add({name:'web', pattern:'/web/:domain/:subdomain', page:'web'})
.add({name:'testscore', pattern:'/testscore/:url', page:'testscore'})