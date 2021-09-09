import React, { Component } from 'react';
import HtlcInfo from '../components/htlcInfo';

const algosdk = require('algosdk');
const indexer_token = "";
const indexer_server = "https://testnet.algoexplorerapi.io/idx2/";
const indexer_port = 0;

let indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);
let car_app_id = 25532407;
class allHTLC extends Component {

    state = {
        list: []
    }

   async getAllHtlc(){
        let data = [];
        try{
            let accountInfo = await indexerClient.searchAccounts()
                    .applicationID(car_app_id).do();
            for (let i = 0; i < accountInfo.accounts.length; i++) {
                let Key = accountInfo.accounts[i].address;
                for (let j = 0; j < accountInfo.accounts[i]['apps-local-state'].length; j++) {
                    if(accountInfo.accounts[i]['apps-local-state'][j].id == car_app_id){
                        let temp =accountInfo.accounts[i]['apps-local-state'][j]['key-value'];
                        if(temp != null && temp.length > 9){
                            let hash;
                            let firstvalid;
                            let lastvalid;
                            let receiver;
                            for (let k = 0; k < temp.length; k++) {                                  
                                (Buffer(temp[k].key, 'base64').toString('ascii') == "FirstValid" ? firstvalid = temp[k].value.uint : Buffer(temp[k].key, 'base64').toString('ascii') == "LastValid" ? lastvalid = temp[k].value.uint: Buffer(temp[k].key, 'base64').toString('ascii') == "Receiver" ? receiver = algosdk.encodeAddress(Buffer(temp[k].value.bytes, 'base64')): Buffer(temp[k].key, 'base64').toString('ascii') == "Hash" ? hash = Buffer(temp[k].value.bytes, 'base64').toString('hex'):console.log("AllHTLC!!!"));           
                            }     
                            
                            data.push({Key:Key,Record:{hash:hash , begin:firstvalid, end: lastvalid, receiver:receiver}});               
                        }
                    }   
                }
            }     
        } catch (error) {
            console.log("GetAllHTLC---->" + error);
        }
        this.setState({list: data});
    }

    componentDidMount(){    
        this.getAllHtlc()
    }

    render() {
        console.log(this.state.htlcList)
        return (
            <HtlcInfo htlcList={this.state.list} />
        );
    }
}

export default allHTLC;