import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
const algosdk = require('algosdk');
let account;
const algodAddress = "https://testnet.algoexplorerapi.io/";
const algodToken = "";
const algodPort ="";
const appIndex = 25532407;
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

// function hashPassPhrase(passPhrase) {
//     const hash = crypto.createHash('sha256')
//     hash.update(passPhrase)
//     return hash.digest('hex')
// }

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
                account = d[1];
            }
            else{
                throw('Primary test account not found in AlgoSigner.');
            }
        })
        .catch((e) => {
            console.log(JSON.stringify(e),'bad');
        });
    }
export default function ChangeCarOwner() {
    const classes = useStyles();

    //States
    const [carID, setCarID] = React.useState('')
    const [carId, setCarId] = React.useState('')
    const [newOwner, setNewOwner] = React.useState('')
    const [hash, setHash] = React.useState('')
    const [firstValid, setFirstValid] = React.useState('')
    const [lastValid, setLastValid] = React.useState('')
    const [receiver, setReceiver] = React.useState('')
    //State Handlers
    const handleCarID = (event) => {
        setCarID(event.target.value)
    }

    const handleCarId = (event) => {
        setCarId(event.target.value)
    }

    const handleNewOwner = (event) => {
        setNewOwner(event.target.value)
    }

    const handleReceiver = (event) => {
        setReceiver(event.target.value)
    }
    const handleFirstValid = (event) => {
        setFirstValid(event.target.value)
    }

    const handleLastValid = (event) => {
        setLastValid(event.target.value)
    }
    const handleHash = (event) => {
        setHash(event.target.value)
    }

    const handleHTLC = async () => {
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
            let params = await algodClient.getTransactionParams().do();
            // comment out the next two lines to use suggested fee
            params.fee = 1000;
            params.flatFee = true;
            let appArgs = [];
            appArgs.push(new Uint8Array(Buffer.from("setHTLC")));
            appArgs.push(new Uint8Array(Buffer.from(hash)));
            let txn = algosdk.makeApplicationNoOpTxn(account.address, params, appIndex, appArgs,[carID,receiver]);
            let txId = txn.txID().toString();
        
            // Sign the transaction
            let base64Tx = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

            let signedTxs = await window.AlgoSigner.signTxn([
             {
                txn: base64Tx,
             },
            ]);
        
            // Get the base64 encoded signed transaction and convert it to binary
           let signedTxn = window.AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob); 
            console.log("Signed transaction with txID: %s", txId);
        
            // Submit the transaction
            await algodClient.sendRawTransaction(signedTxn).do();
        
            // Wait for confirmation
            await waitForConfirmation(algodClient, txId);
        
            // display results
            let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
            console.log("Called app-id:",transactionResponse['txn']['txn']['apid'])
            if (transactionResponse['global-state-delta'] !== undefined ) {
                console.log("Global State updated:",transactionResponse['global-state-delta']);
            }
            if (transactionResponse['local-state-delta'] !== undefined ) {
                console.log("Local State updated:",transactionResponse['local-state-delta']);
            }
            }catch(error){
                console.log(`Failed: AddCar - ${error}`);
                return 0;
            }
    }

    const handleSubmit = async () => {
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
            let params = await algodClient.getTransactionParams().do();
            // comment out the next two lines to use suggested fee
            params.fee = 1000;
            params.flatFee = true;
            let appArgs = [];
            appArgs.push(new Uint8Array(Buffer.from("changeOwner")));
            appArgs.push(new Uint8Array(Buffer.from(newOwner)));
            let txn = algosdk.makeApplicationNoOpTxn(account.address, params, appIndex, appArgs,[carId]);
            let txId = txn.txID().toString();
        
            // Sign the transaction
            let base64Tx = window.AlgoSigner.encoding.msgpackToBase64(txn.toByte());

            let signedTxs = await window.AlgoSigner.signTxn([
             {
                txn: base64Tx,
             },
            ]);
        
            // Get the base64 encoded signed transaction and convert it to binary
           let signedTxn = window.AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob); 
            console.log("Signed transaction with txID: %s", txId);
        
            // Submit the transaction
            await algodClient.sendRawTransaction(signedTxn).do();
        
            // Wait for confirmation
            await waitForConfirmation(algodClient, txId);
        
            // display results
            let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
            console.log("Called app-id:",transactionResponse['txn']['txn']['apid'])
            if (transactionResponse['global-state-delta'] !== undefined ) {
                console.log("Global State updated:",transactionResponse['global-state-delta']);
            }
            if (transactionResponse['local-state-delta'] !== undefined ) {
                console.log("Local State updated:",transactionResponse['local-state-delta']);
            }
            }catch(error){
                console.log(`Failed: AddCar - ${error}`);
                return 0;
            }
    }

    return (
        <div>
            <br></br>
            <h2>Set HTLC</h2>
            <br></br>
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="CarID"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarID}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Hash"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleHash}
            />
            {/*<TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="First Valid Round"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleFirstValid}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Last Valid Round"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleLastValid}
            />*/}
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Receiver"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleReceiver}
            />
            <Button onClick={handleHTLC}>
                Submit
            </Button>
            <br></br>
            <h2>Unlock HTLC</h2>
            <br></br>
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="CarID"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarId}
            />
            <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Secret Key"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleNewOwner}
            />
            <Button onClick={handleSubmit}>
                Submit
            </Button>
            <br></br>
        </div>
    );
}
