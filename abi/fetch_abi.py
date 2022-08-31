#!/usr/bin/python
import argparse
import requests
import json

parser = argparse.ArgumentParser()
parser.add_argument('addr', type=str, help='Contract Address')
parser.add_argument('-o', '--output', type=str, help="Output ABI JSON File", required=True)

args = parser.parse_args()

providers = {
    'etherscan': {
        'key' : '',
        'endpoint' : lambda: 'https://api.etherscan.io/api?module=contract&action=getabi&address=%s&apikey=%s'%(args.addr, providers['etherscan']['key'] )
    }
}

def __main__():

    response = requests.get( providers['etherscan']['endpoint']() )
    response_json = response.json()
    abi_json = json.loads(response_json['result'])
    result = json.dumps(abi_json, indent=4, sort_keys=True)

    open(args.output, 'w').write(result)

if __name__ == '__main__':
    __main__()
