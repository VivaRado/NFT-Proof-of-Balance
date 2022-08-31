const jwt   = require('jsonwebtoken');
const Web3  = require('web3');
const axios = require('axios');
const path  = require('path');
const fs    = require('fs');
// link API keys (private)
require("dotenv").config({ path: "./process.env" })

let contract = undefined;
let abi;

// Property Contract Adresses
const property = {
	proxy : "0xe87a68de82204bfa63e4d626d4c5194481cf3b59", // manager proxy where balanceOf would be available e.g. https://etherscan.io/address/0xe87a68de82204bfa63e4d626d4c5194481cf3b59#readContract
	nft: "0xFd7ca4289770FbA797957e37Be66912faDCE5D56"
}

// Balance Requirements and Answer if you Prove Balance.
const balance = {
	secret : 'P19hLTW3S3', // Random
	message: 'Sign for NFT Proof of Balance', // has to be the same as client_message in controller.js
	duration: '10m',
	requirement: 1,
	answer: '42' // if user proves balance give the answer to life, the universe, and everything.
}

// Providers
const providers = {
	infura: {
		key: process.env.KEY_INFURA, // infura API key
		endpoint: function() { 
			return `https://mainnet.infura.io/v3/${this.key}`; // infura endpoint URL
		} 
	},
	etherscan: {
		key: process.env.KEY_ETHERSCAN, // etherscan API key
		endpoint: function() { 
			return `https://api.etherscan.io/api?module=contract&action=getabi&address=${property.proxy}&apikey=${this.key}`; // etherscan endpoint URL
		}
	}
}


// connect to public RPC URL
const web3 = new Web3( new Web3.providers.HttpProvider( providers.infura.endpoint() ) );

if (__parse_abi) {
	axios.get( providers.etherscan.endpoint() ).then( function(res){
		if (res.data.status == 1) {
			abi = JSON.parse(res.data.result);
			contract = new web3.eth.Contract(abi, property.nft);
			console.log("Parsed ABI")
		} else {
			throw Error('Could Not Retrieve ABI (Application Binary Interface), Review Credentials for Providers: Etherscan');
		}
	});
} else {
	
	// Already have the ABI of used /abi/fetch_abi.py (same as above but a python script)
	abi = JSON.parse( fs.readFileSync( path.join( __root, 'abi', 'abi.json') ) );
	contract = new web3.eth.Contract(abi, property.nft);

}

module.exports = function(app){

	app.get('/api/data', parseToken, function(req, res){
		jwt.verify(req.token, balance.secret, function(e){
			if (e) {
				res.sendStatus(403);
			} else {
				res.status(200).json(balance.answer);
			};
		});
	});

	app.post('/api/verify', function(req, res){

		// authenticate as address owner
		let address;
		try {
			address = req.body.address;
			const signer = web3.eth.accounts.recover(balance.message, req.body.signature);
			if (signer !== address) {
				return res.sendStatus(401);
			};
		} catch {
			return res.sendStatus(400);
		}

		contract.methods.balanceOf(address).call( function(e, bal){
			if (e) {
				res.status(500).send('Problem communicating with ethereum')
			} else {
				if (parseFloat(bal) >= balance.requirement){
					jwt.sign(req.body, balance.secret, { expiresIn: balance.duration }, (e, token) => {
						res.status(200).json({token});
					});
				} else {
					res.status(401).send(`NFT Balance Not Met`)
				}
			}

		});
	});

	function parseToken(req, res, next) {
		const authHeader = req.headers['authorization'];
		if (typeof authHeader !== 'undefined') {
			req.token = authHeader.split(' ')[1];
			next();
		} else res.sendStatus(403);
	}

	//other api routes..
}