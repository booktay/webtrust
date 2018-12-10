const routes = require('next-routes')

module.exports = routes()   
.add({name:'index', pattern:'/', page:'Index'})
.add({name:'domain', pattern:'/domain/:domain/:subdomain', page:'domain'})
// .add({name:'dashboard', pattern:'/dashboard', page:'dashboard'})
// .add({name:'score', pattern:'/score', page:'score'})
// .add({name:'domain_name', pattern:'/domain/:domain/:subdomain', page:'resultDomain'})
// .add({name:'web', pattern:'/web', page:'web'})
// .add({name:'api', pattern:'/api/:type(score|rule)/:arg1/:arg2', page:'api'})