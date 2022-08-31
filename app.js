'use strict';

global.__root 		= __dirname;
global.__parse_abi 	= false;
const exp 			= require('express');
const exphbs 		= require('express-handlebars');
const Handlebars 	= require('handlebars');
const path 			= require('path');
const bodyParser 	= require('body-parser');
const port 			= require( path.join( __root, 'port.js' ) );
const ext 			= ".hbs";
const lim 			= '100mb';

const app = exp();

const hbs = exphbs.create({
	defaultLayout	: path.join(__root, 'layout', 'default'),
	extname			: ext,
	handlebars		: Handlebars,
	partialsDir		: [ path.join(__root, 'views', 'partials'), path.join(__root, 'views', 'templates') ]
});

app.disable('x-powered-by');
app.engine(ext, hbs.engine);
app.set('view engine', ext);

app.use(bodyParser.json({limit: lim}))
	.use(bodyParser.urlencoded({limit: lim, extended: true}));

// Link static
app.use( exp.static(__root))
	.use( exp.static( path.join(__root,'public','js') ))
	.use( exp.static( path.join(__root,'public','css') ))
	.use( exp.static( path.join(__root,'public','img') ));


// link modules for client script tag linking to /dist linked in layouts/default
var use_client = ["web3", "handlebars", "handlebars.binding", "jquery", "axios", "tinybind"];
for (var i = 0; i < use_client.length; i++) app.use("/dist",exp.static( path.join(__root,"node_modules",use_client[i],"dist") ) );


// link routes and API
require( path.join( __root, 'routes', 'routes.js') )(app)
require( path.join( __root, 'routes', 'api.js') )(app)


const server = require('http')
	.createServer(app)
	.listen(port.port, function () {
		console.log( port.host +' listening on: '+ port.port );
	});


