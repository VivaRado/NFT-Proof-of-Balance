const path = require('path');

module.exports = function(app){

	app.get('/', function(req, res){

		var data = { 
			layout: path.join(__root,'views', 'layouts', 'default'),
			title: 'NFT POB'
		};
		
		res.render( __root+'/views/index', data );
	
	});

	//other routes..
}