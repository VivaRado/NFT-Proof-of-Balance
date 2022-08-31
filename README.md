## **Preface**

**NFT Proof of Balance** (NFT POB) includes functionality that examines the wallet of a user (via MetaMask) for proof of balance of an NFT and provides the answer to life, the universe, and everything.

## **Introduction**

**NFT POB** is a [nodeJS](https://nodejs.org/en/) application that runs on [Express](https://www.npmjs.com/package/express), depends on [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [web3](https://www.npmjs.com/package/web3), [axios](https://www.npmjs.com/package/axios). For the templating we use [Handlebars](https://www.npmjs.com/package/handlebars), [Handlebars.binding](https://www.npmjs.com/package/handlebars.binding) and [TinyBind](https://www.npmjs.com/package/tinybind), interactivity is handled by [JQuery](https://www.npmjs.com/package/jquery).

To use the code you will need to register accounts in [Infura](https://infura.io) and [Etherscan](https://etherscan.io) and obtain API Keys.

## **Usage**


### Installation:

To run this code as is:

1. Obtain Infura and Etherscan API Keys.
1. Clone this repo: ```git clone https://github.com/VivaRado/NFT-Proof-of-Balance```
1. Install: ```npm install```
1. Create a process.env file and add:
	* ```KEY_ETHERSCAN="Your Etherscan Key"	```
	* ```KEY_INFURA="Your Infura Key"```

1. Now you can test **NFT POB** with our **Preview NFT**:
	* ```node app```
	* open browser at ```6006```

### Configuration:

To run this code with your own NFT and ABI:

1. Find your ABI Contract Address and NFT Contract Address.
	* Update ```const property``` in ```./routes/api.js``` with your ABI Contract Address and NFT Address.
1. Fetch the ABI(Application Binary Interface) yourself with provided python script:
	* ```cd``` to repo ```./abi```
	* Change the ABI in  **fetch_abi.sh** ```ABI=0x...``` with your own ABI Contract Address e.g.: [Example Contract Proxy](https://etherscan.io/address/0xD945f759d422Ae30a6166838317B937dE08380E3#readProxyContract)
	* Run **fetch_abi.sh** ```sh './fetch_abi.sh'```

1. ...or let **axios** fetch the ABI on server startup by changing ```global.__parse_abi``` to ```true``` in ```./app.js```.


## **Profile**

*   Company: VivaRado LLP
*   Twitter: [@vivarado](https://twitter.com/VivaRado)
*   OpenSea: [@vivarado](https://opensea.io/vivarado)

---

