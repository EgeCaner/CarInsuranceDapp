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
                    let temp =accountInfo.accounts[i]['apps-local-state'][j]['key-value'];
                    if(accountInfo.accounts[i]['apps-local-state'][j].id == insurance_app_id && temp != null && temp.length >= 1){
                        insuranceID =Buffer(accountInfo.accounts[i]['apps-local-state'][j]['key-value'][0].value.bytes, 'base64').toString('ascii');
                        check = true;
                    }                   
                    if(temp != null && temp.length > 2 && check && accountInfo.accounts[i]['apps-local-state'][j].id == car_app_id){
                            let make;
                            let color;
                            let model;
                            let owner;
                            let year;
                            for (let k = 0; k < temp.length; k++) {                                  
                                (Buffer(temp[k].key, 'base64').toString('ascii') == "CarManufacturer" ? make = Buffer(temp[k].value.bytes, 'base64').toString('ascii') : Buffer(temp[k].key, 'base64').toString('ascii') == "CarColor" ? color = Buffer(temp[k].value.bytes, 'base64').toString('ascii') : Buffer(temp[k].key, 'base64').toString('ascii') == "CarModel" ? model = Buffer(temp[k].value.bytes, 'base64').toString('ascii') : Buffer(temp[k].key, 'base64').toString('ascii') == "ProdYear" ? year = Buffer(temp[k].value.bytes, 'base64').toString('ascii'):Buffer(temp[k].key, 'base64').toString('ascii') == "Owner" ? owner = algosdk.encodeAddress(Buffer(temp[k].value.bytes, 'base64')): console.log("AllCarsEmptyEntity!!!"));                             
                        }    
                        check =false;       
                        data.push({Key:car,Record:{owner:owner , make:make, model:model, color:color, insurance: insuranceID,year: year}});
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