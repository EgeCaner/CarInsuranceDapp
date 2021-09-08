import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
const algosdk = require('algosdk');
let account;
const algodAddress = "https://testnet.algoexplorerapi.io/";
const algodToken = "";
const algodPort ="";
let stateless_acc_addr;

let algodClient = new algosdk.Algodv2(algodToken, algodAddress, algodPort);

var check =algodClient.healthCheck().do();
if (check){
    console.log("client connected")
}
const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const waitForConfirmation = async function (algodclient, txId) {
    let status = (await algodclient.status().do());
    let lastRound = status["last-round"];
      while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
          //Got the completed Transaction
          console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
          break;
        }
        lastRound++;
        await algodclient.statusAfterBlock(lastRound).do();
      }
    };

    async function getTestNetPrimaryAccount(){
        await window.AlgoSigner.accounts({ledger: 'TestNet'})
        .then((d) => {
            if(d && d.length > 0){
                console.log(`Account found: ${JSON.stringify(d[0])}`);
                account = d[0];
            }
            else{
                throw('Primary test account not found in AlgoSigner.');
            }
        })
        .catch((e) => {
            console.log(JSON.stringify(e),'bad');
        });
    }

    async function payment(to, amount, client){
        try{
        window.AlgoSigner.connect()
          .then((d) => {
            console.log("Connect")
          })
          .catch((e) => {
            console.error(e);
          });
        getTestNetPrimaryAccount();
        // get node suggested parameters
        let params = await client.getTransactionParams().do();
        // comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;
    
        // create unsigned transaction   [str:addCar, str:Skoda, str: ]
        //let state= await client.accountInformation(account.addr).do()
        //let txn = algosdk.makeApplicationOptInTxn(sender, params, index);
        const closeToRemaninder = undefined;
        const note = undefined;
        let txn = algosdk.makePaymentTxnWithSuggestedParams(account.address, to, amount, closeToRemaninder, note, params);
        let txId = txn.txID().toString();
        let base64Tx = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());
    
        let signedTxs = await window.AlgoSigner.signTxn([
         {
            txn: base64Tx,
         },
        ]);
    
        // Get the base64 encoded signed transaction and convert it to binary
       let signedTxn = window.AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);    
        // Sign the transaction
        console.log("Signed transaction with txID: %s", txId);
    
        // Submit the transaction
        await client.sendRawTransaction(signedTxn).do();
    
        // Wait for confirmation
        await waitForConfirmation(client, txId);
    
        // display results
        let transactionResponse = await client.pendingTransactionInformation(txId).do();
        console.log("Called app-id:",transactionResponse['txn']['txn']['apid'])
        if (transactionResponse['global-state-delta'] !== undefined ) {
            console.log("Global State updated:",transactionResponse['global-state-delta']);
        }
        if (transactionResponse['local-state-delta'] !== undefined ) {
            console.log("Local State updated:",transactionResponse['local-state-delta']);
        }
        }catch(error){
            console.log(`Failed: Payment: - ${error}`);
            return 0;
        }
    
    }
    async function optIn(){
        try{
             // get suggested parameters
        const params = await algodClient.getTransactionParams().do();
        // comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;
    
        let rand =Math.floor(Math.random() * 2**64);
        const data = "#pragma version 4\n" + "int "+rand.toString()+"\nint "+rand.toString()+"\n>\nbz success\nint 1\nreturn\nsuccess:\nint 1\nreturn";
        const  results = await algodClient.compile(data).do();
        console.log("Hash = " + results.hash);
        console.log("Result = " + results.result);
    
        const program = new Uint8Array(Buffer.from(results.result, "base64"));
        
        const lsig = algosdk.makeLogicSig(program);
        console.log("lsig : " + lsig.address());   
    
        // create a transaction
        const sender = lsig.address();
        await payment(sender, 3000000, algodClient);
        stateless_acc_addr = sender;
    
        const txn_1 = algosdk.makeApplicationOptInTxn(sender, params, 25540600);
        const txn_2 = algosdk.makeApplicationOptInTxn(sender, params, 25532407);
        let txns = [txn_1, txn_2];
        let txgroup = algosdk.assignGroupID(txns);
        const rawSignedTxn_1 = algosdk.signLogicSigTransactionObject(txgroup[0], lsig);
        const rawSignedTxn_2 = algosdk.signLogicSigTransactionObject(txgroup[1], lsig);
        let signed =[rawSignedTxn_1.blob, rawSignedTxn_2.blob];
        // send raw LogicSigTransaction to network
        const tx = await algodClient.sendRawTransaction(signed).do();
        console.log("Transaction : " + tx.txId);   
        await waitForConfirmation(algodClient, tx.txId);
        return lsig.address();
        }catch(error){
            console.log("OptIn: "+error);
        }
    }

export default function AddCar() {
    const classes = useStyles();

    //States
    const [carID, setCarID] = React.useState('')
    const [carMake, setCarMake] = React.useState('')
    const [carModel, setCarModel] = React.useState('')
    const [carColor, setCarColor] = React.useState('')
    const [carOwner, setCarOwner] = React.useState('')
    const [carInsurance, setCarInsurance] = React.useState('')

    //Handlers
    const handleCarID = (event) => {
        setCarID(event.target.value)
    }

    const handleCarModel = (event) => {
        setCarModel(event.target.value)
    }

    const handleCarMake = (event) => {
        setCarMake(event.target.value)
    }

    const handleCarColor = (event) => {
        setCarColor(event.target.value)
    }

    const handleCarOwner = (event) => {
        setCarOwner(event.target.value)
    }

    const handleCarInsurance = (event) => {
        setCarInsurance(event.target.value)
    }

   const handleSubmit = async function () {
        try{
            if (typeof window.AlgoSigner !== 'undefined') {
                console.log("algosigner installed");
              } else {
                console.log("algosigner not installed");
              }
              window.AlgoSigner.connect()
              .then((d) => {
                console.log("Connect")
              })
              .catch((e) => {
                console.error(e);
              });
            getTestNetPrimaryAccount();
            // get node suggested parameters
            await optIn();
            let params = await algodClient.getTransactionParams().do();
            // comment out the next two lines to use suggested fee
            params.fee = 1000;
            params.flatFee = true;
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("createInsurance")));
            appArg.push(new Uint8Array(Buffer.from(carInsurance)));
            let appArr = [25532407]
            // create unsigned transaction   [str:addCar, str:Skoda, str: ]
            //let state= await client.accountInformation(account.addr).do()
            //let txn = algosdk.makeApplicationOptInTxn(sender, params, index);
            let txn_1 = algosdk.makeApplicationNoOpTxn(account.address, params, 25540600, appArg,[stateless_acc_addr],appArr);
            let appArgs = [];
            appArgs.push(new Uint8Array(Buffer.from("addCar")));
            appArgs.push(new Uint8Array(Buffer.from(carMake)));
            appArgs.push(new Uint8Array(Buffer.from(carModel)));
            appArgs.push(new Uint8Array(Buffer.from(carColor)));
            appArgs.push(new Uint8Array(Buffer.from(carOwner)));
            let txn_2 = algosdk.makeApplicationNoOpTxn(account.address, params, 25532407, appArgs, [stateless_acc_addr]);
            let txns = []
            txns.push(txn_2);
            txns.push(txn_1);
            let txgroup = algosdk.assignGroupID(txns);
            let signed =[]
            let base64Tx_O = window.AlgoSigner.encoding.msgpackToBase64(txgroup[0].toByte());
            let base64Tx_1 = window.AlgoSigner.encoding.msgpackToBase64(txgroup[1].toByte());
            let signedTxs_0 = await window.AlgoSigner.signTxn([
                {
                   txn: base64Tx_O,
                }]);
            let signedTxs_1 = await window.AlgoSigner.signTxn([
                {
                   txn: base64Tx_1,
                }]);
            signed.push(window.AlgoSigner.encoding.base64ToMsgpack(signedTxs_0[0].blob)); 
            signed.push(window.AlgoSigner.encoding.base64ToMsgpack(signedTxs_1[0].blob));  
            let tx = (await algodClient.sendRawTransaction(signed).do());
            console.log("Transaction : " + tx.txId);
            await waitForConfirmation(algodClient, tx.txId)
        }catch(error){
            console.log(`Failed: AddCar - ${error}`);
            return 0;
        }
    }

    return (
        <div>
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Car Make"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarMake}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Car Model"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarModel}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Car Color"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarColor}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Production Year"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarOwner}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Car Insurance"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarInsurance}
            />
            <Button onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
}
