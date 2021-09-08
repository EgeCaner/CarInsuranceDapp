import React, { Component } from 'react';
import CardInsurance from '../components/cardInsurance';
const algosdk = require('algosdk');
const indexer_token = "";
const indexer_server = "https://testnet.algoexplorerapi.io/idx2/";
const indexer_port = 0;

let indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);
let car_app_id = 25532407;
let insurance_app_id = 25540600;
class allCarInsurances extends Component {

    state = {
        carList: []
    }

   async getAllCars(){
        let data = [];
        let check= false;
        try {
            let accountInfo = await indexerClient.searchAccounts()
                .applicationID(insurance_app_id).do();
            for (let i = 0; i < accountInfo.accounts.length; i++) {
                let car = accountInfo.accounts[i].address;
                let insuranceID;
                for (let j = 0; j < accountInfo.accounts[i]['apps-local-state'].length; j++) {
                    if(accountInfo.accounts[i]['apps-local-state'][j].id == insurance_app_id && accountInfo.accounts[i]['apps-local-state'][j]['key-value'] != null && accountInfo.accounts[i]['apps-local-state'][j]['key-value'].length >= 1){
                        insuranceID =Buffer(accountInfo.accounts[i]['apps-local-state'][j]['key-value'][0].value.bytes, 'base64').toString('ascii');
                        check = true;
                    }
                    if(accountInfo.accounts[i]['apps-local-state'][j].id == car_app_id && accountInfo.accounts[i]['apps-local-state'][j]['key-value'] != null && check &&accountInfo.accounts[i]['apps-local-state'][j]['key-value'].length > 2){    
                        let color =Buffer(accountInfo.accounts[i]['apps-local-state'][j]['key-value'][0].value.bytes, 'base64').toString('ascii');    
                        let make =Buffer(accountInfo.accounts[i]['apps-local-state'][j]['key-value'][1].value.bytes, 'base64').toString('ascii');    
                        let model =Buffer(accountInfo.accounts[i]['apps-local-state'][j]['key-value'][2].value.bytes, 'base64').toString('ascii'); 
                        let owner =Buffer(accountInfo.accounts[i]['apps-local-state'][j]['key-value'][4].value.bytes, 'base64').toString('ascii');  
                        data.push({Key:car, Record:{owner:owner , make:make, model:model, color:color, insurance: insuranceID}});
                        check = false;
                    }    
                }
            }    
        } catch (error) {
            console.log("GetAllInsurance ---->" + error);
        }
        this.setState({carList: data});
    }

    componentDidMount(){    
        this.getAllCars()
    }

    render() {
        console.log(this.state.carList)
        return (
            <CardInsurance carInsList={this.state.carList} />
        );
    }
}

export default allCarInsurances;