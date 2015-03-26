var express = require('express');
var hbs = require('hbs');

var app = express();
app.set('view engine', 'html');     // Treat HTML files as dynamic
app.engine('html', hbs.__express);  // Load templating engine
app.use(require('./routes'));
app.use(express.static('public'));

app.listen('8081');
console.log('Listening on port 8081');
