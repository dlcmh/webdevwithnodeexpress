var fortune = require('./lib/fortune.js')
var express = require('express')
var app = express()

// set up handlebars view engine
var handlebars = require('express-handlebars').create({defaultLayout: 'main'}) // views/layouts/main.handlebars will be the default layout used for any view, unless specified otherwise
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

// set up the port
app.set('port', process.env.PORT || 27887)

// set up static middleware before declaring any routes
app.use(express.static(__dirname + '/public'))

// set up middleware to detect test=1 in the querystring
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'
  next()
})

// GET Routes
app.get('/', function(req, res) {
  res.render('home')
})


app.get('/about', function(req, res) {
  res.render('about', {fortune: fortune.getFortune(), pageTestScript: '/qa/tests-about.js'})
})


// 500 catch-all handler (middleware)
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500)
  res.render('500')
})

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
  res.status(404)
  res.render('404')
})


// Start the server
app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate.')
})
