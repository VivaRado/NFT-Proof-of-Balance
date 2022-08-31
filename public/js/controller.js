
new Handlebars.Binding(Handlebars);

let btn_msg,
	btn_verify,
	state,
	conds,
	state_b;


state = {
	web3: undefined,
	account: undefined,
	token: undefined,
	data: [],
	content_exist: false,
	content_data: undefined,
	message: "",
	msg_con: "Connect Metamask",
	msg_ver: "Verify",
	nft_url: 'https://create.zora.co/editions/0xfd7ca4289770fba797957e37be66912fadce5d56',
	report: "rep_gray"
};

// Updates Handlebars Bindings
function updateBind(s, d, cb){
	for(var y in d) s[y] = d[y];
	Handlebars.update();
	if (cb) return cb();
}

async function connectWallet(param0) {
	// ethereum injection
	if (window.ethereum) {
		const web3a = new Web3(window.ethereum);
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			updateBind(state, {web3: web3a})
			web3a.eth.getAccounts().then(accs => {
				updateBind(state, {account: accs[0], message: "Connected to Metamask Account", msg_con: "Connected", report: "rep_success"})
			});
		} catch (error) {
			
			updateBind(state, {message: error, report: "rep_error"})

		}
	} else { // user has no wallet

		updateBind(state, {message: "Metamask Not Found", report: "rep_error"})

	};

}

function verifyNFT(){
	// have the user sign our message
	var client_message = 'Sign for NFT Proof of Balance';
	state.web3.eth.personal
		.sign(state.web3.utils.toHex(client_message), state.account)
		.then( function(signature){
			// send signature and address to api
			var data_send = {
				signature: signature, 
				address: state.account
			};

			axios.post('api/verify', data_send).then( function(r){
				// store token
				if (r.status === 200) {
					updateBind(state,{token: r.data.token}, function(){
						updateBind(state, {message: "NFT Balance Proven.", msg_ver: "Verified", report: "rep_success"})
						// fetch data
						fetchData();
					});
				}

			}).catch(function(e){

				updateBind(state, {message: e.response.data, msg_ver: "Mint", report: "rep_error"})
				$(".btn_verify").attr("onclick", "window.open('"+state.nft_url+"')")

			});

		});
}
function fetchData(){

	// can only fetch data with valid token
	if (state.token === undefined)
		return console.log("Cannot fetch data without valid token.");
	// fetch data
	var data_send = {
		headers: {'Authorization': `Bearer ${state.token}`}
	}

	axios.get('api/data', data_send).then(function(r){
			
		state.data = r.data;
		updateBind(state, {content_exist: true})
		updateBind(state, {content_data: r.data})

	});

}

////// UX Controller

function InitInterface(){

	this.ui_report = function(){
		
		var tmp_comp = Handlebars.compile(document.getElementById("tmp_report").innerHTML);
		$("#ui_report")[0].appendChild( Handlebars.parseHTML(tmp_comp(state))[0]);

	}
	
	this.ui_condition = function(){
		
		var tmp_comp = Handlebars.compile(document.getElementById("tmp_condition").innerHTML);
		$("#ui_condition")[0].appendChild( Handlebars.parseHTML(tmp_comp(state))[0]);

	}

}

$(function(){

	initInt = new InitInterface();
	initInt.ui_report();
	initInt.ui_condition();

	updateBind(state, {message: "Awaiting Connection Request", report: "rep_gray"})

	$(".btn_connect").on("click", function(){ 
		updateBind(state, {message: "Communicating Metamask", msg_con: "Connecting", report: "rep_blue"})
		connectWallet();
	}); 

	tinybind.bind($(".status_color_coding")[0], {state: state})

});


function InitVerification(){
	updateBind(state, {message: "Veryfication Pending in Metamask", msg_ver: "Verifying", report: "rep_blue"})
	verifyNFT()
}
