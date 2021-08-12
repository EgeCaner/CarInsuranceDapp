var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

// var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
// app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const RESET = '\x1b[0m';
const BLUE = '\x1b[34m';
const crypto = require('crypto');
// import { cryptoRandomString } from "crypto-random-string";
const collection = 'asset_lock'

var allSecretPairs = []
var insuranceSecrets = []
var gateWay_Car
var gateway_Insurance

function hashPassPhrase(passPhrase) {
    const hash = crypto.createHash('sha256')
    hash.update(passPhrase)
    return hash.digest('hex')
}

function generateRandomSecret(key, arr) {
    // let randSecret = cryptoRandomString({ length: 10, type: 'base64' })
    let randSecret = 'TestingPassPhrase'
    arr[key] = { secret: randSecret, hash: hashPassPhrase(randSecret) }
    return arr[key]
}

function deleteSecrets(key, arr) {
    delete arr[key]
}

function updateSecrets(secretDict, newSecret) {
    secretDict.secret = newSecret
    secretDict.hash = hashPassPhrase(newSecret)
}

function addSecret(arr, key, secretDict) {
    arr[key] = secretDict
}



async function createCar(carID, carMake, carModel, carColor, carOwner) {
    try {
        console.log(`${BLUE} **** INVOKE CREATECAR ****${RESET}`);
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');
        contract.addDiscoveryInterest({ name: 'fabcar', collectionNames: ['assetCollection'] });

        let listener;
        let eventTransaction;

        try {
            listener = async (event) => {
                const asset = JSON.parse(event.payload.toString())
                console.log(`${GREEN}<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}${RESET}`);
                eventTransaction = event.getTransactionEvent();
                console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
            }
            await contract.addContractListener(listener)
        } catch (err) {
            console.log(`${RED}<-- Failed: Setup contract events - ${err}${RESET}`);
            return 0;
        }

        try {
            //     let assetSecrets = generateRandomSecret(carID, allSecretPairs)
            //     let privateCarData = { docType: 'car', secretKey: assetSecrets.secret, hash: assetSecrets.hash }
            //     let stateFulTxn = contract.createTransaction('createCar')
            //     let tmapData = Buffer.from(JSON.stringify(privateCarData))
            //     stateFulTxn.setTransient({
            //         asset_properties: tmapData
            //     })
            //     await stateFulTxn.submit(carID, carMake, carModel, carColor, carOwner)
            // await stateFulTxn.submit('CAR2025', 'Bugatti', 'Accord', 'Blue', 'Son Goku')
            await contract.submitTransaction('createCar', carID, carMake, carModel, carColor, carOwner);
        } catch (err) {
            console.log(`${RED}<-- Failed: Transaction Submission - ${err}${RESET}`);
            return 0;
        }

        await gateway.disconnect();
        return eventTransaction

    } catch (err) {
        console.log(`${RED}<-- Failed to create Car - ${err}${RESET}`);
        return 0;
    }
}

async function deleteCar(carID) {
    try {
        console.log(`${BLUE} **** INVOKE DELETECAR ****${RESET}`);
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        const result = await contract.submitTransaction('deleteCar', carID);

        await gateway.disconnect();

        // console.log(JSON.parse(result));
        console.log(`${RED}<----Transaction has been evaluated, result is: ${result.toString()}${RESET}`);

    } catch (err) {
        console.log(`${RED}<-- Failed to Delete Car - ${err}${RESET}`);
    }
}

async function addInsurance(carNumber, owner, insurance) {
    try {
        console.log(`${BLUE} **** INVOKE ADDINSURANCE ****${RESET}`);
        const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser3');
        if (!identity) {
            console.log('An identity for the user "appUser3" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser3', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        let listener;
        let eventTransaction;

        try {
            listener = async (event) => {
                const asset = JSON.parse(event.payload.toString())
                console.log(`${GREEN}<-- Contract Event Received: ${event.eventName} - ${JSON.stringify(asset)}${RESET}`);
                eventTransaction = event.getTransactionEvent();
                console.log(`*** transaction: ${eventTransaction.transactionId} status:${eventTransaction.status}`);
                console.log(eventTransaction)
            }
            await contract.addContractListener(listener)
        } catch (err) {
            console.log(`${RED}<-- Failed: Setup contract events - ${err}${RESET}`);
            return 0;
        }

        try {
            // let privateCarData = { docType: 'car', secretKey: passPhrase }
            // let stateFulTxn = contract.createTransaction('createInsurance')
            // let tmapData = Buffer.from(JSON.stringify(privateCarData))
            // stateFulTxn.setTransient({
            //     asset_insurance: tmapData
            // })
            // await stateFulTxn.submit(carNumber, owner, insurance)
            await contract.submitTransaction('createInsurance', carNumber, owner, insurance);
        } catch (err) {
            console.log(`${RED}<-- Failed: Transaction Submission - ${err}${RESET}`);
            return 0;
        }

        await gateway.disconnect();
        return 1

    } catch (err) {
        console.log(`${RED}<-- Failed to add insurance to car - ${err}${RESET}`);
        return 0
    }
}


async function buildCcpOrg1() {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        return gateway

    } catch (err) {
        throw new Error('Failure in connecting to org1 ', err)
    }
}

async function buildCcpOrg2() {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser3');
        if (!identity) {
            console.log('An identity for the user "appUser3" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser3', discovery: { enabled: true, asLocalhost: true } });
        return gateway

    } catch (err) {
        throw new Error('Failure in connecting to org2 ', err)
    }
}

router.get('/api/queryallcars', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(JSON.parse(result));
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // res.render("allcars", { list: JSON.parse(result) });
        res.status(200).send(JSON.parse(result))
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});


router.post('/api/addcar', async function (req, res) {
    let createCarEvent = await createCar(req.body.carID, req.body.carMake, req.body.carModel, req.body.carColor, req.body.carOwner)

    if (createCarEvent != 0) {
        //createCar transaction listener was fired, now handle it
        let addInsuranceEvent = await addInsurance(req.body.carID, req.body.carOwner, 1000, req.body.passPhrase)
        //Check if event succeeded
        if (addInsuranceEvent != 0) {
            res.status(200).send({status: 200, message: `Transaction Submitted: Car Added for ${req.body.carOwner}`})
        }
    } else {
        //Revoke Changes
        await deleteCar(req.body.carID)
        res.status(500).send({status: 500, message: `Error!!! Failed to add Car for ${req.body.carOwner}`})
    }
})



router.put('/api/changeowner', async function (req, res) {

    //Connect to Org1
    var network_car
    var contract_car
    var lockResult_Car
    var secrets_Car
    try {
        gateWay_Car = buildCcpOrg1()
        // Get the network (channel) our contract is deployed to.
        network_car = await gateWay_Car.getNetwork('mychannel');

        // Get the contract from the network.
        contract_car = network.getContract('fabcar');

    } catch (error) {
        console.log(error)
    }

    //Connect to Org2
    var network_insurance
    var contract_insurance
    var lockResult_Insurance
    var secrets_insurance
    try {
        gateway_Insurance = buildCcpOrg2()
        // Get the network (channel) our contract is deployed to.
        network_insurance = await gateWay_Car.getNetwork('mychannel');

        // Get the contract from the network.
        contract_insurance = network.getContract('fabcar');

    } catch (error) {
        console.log(error)
    }

    //Lock asset on first chain
    try {
        secrets_Car = generateRandomSecret(req.body.carID, allSecretPairs)
        let privateLockData = { lockTime: Math.abs(new Date), hash: secrets_Car.hash }
        let stateFulTxn = contract.createTransaction('hashLockAsset')
        let tmapData = Buffer.from(JSON.stringify(privateLockData))
        stateFulTxn.setTransient({
            asset_properties: tmapData
        })
        lockResult_Car = await stateFulTxn.submit(req.body.carID, 'asset_properties')
    } catch (error) {
        // console.log('Asset Already Locked')
        res.status(403).send({status: 403, message: `Car Asset Locked!!! Cannot be accessed currently`})
        //Unlock asset on chain A
        // try {
        //     const result = await contract_insurance.evaluateTransaction('removeHashLock','assetCollection', req.body.carID);
        // } catch (error) {
        //     res.status(403).send({status: 403, message: `Asset Locked!!! Cannot be accessed currently`})
        // }
        // res.status(500).send(error)
    }
    //Lock Asset  on second chain
    try {
        secrets_insurance = generateRandomSecret(req.body.carID, insuranceSecrets)
        let privateLockData = { lockTime: Math.abs(new Date), hash: secrets_insurance.hash }
        let stateFulTxn = contract.createTransaction('hashLockAsset')
        let tmapData = Buffer.from(JSON.stringify(privateLockData))
        stateFulTxn.setTransient({
            asset_properties: tmapData
        })
        lockResult_Insurance = await stateFulTxn.submit(req.body.carID, 'asset_properties')
    } catch (error) {
        console.log('Asset Already Locked')
        res.status(403).send({status: 403, message: `Insurance Asset Locked!!! Cannot be accessed currently`})
        //Unlock asset on chain A
        // try {
        //     const result = await contract_car.evaluateTransaction('removeHashLock','assetCollection', req.body.carID);
        // } catch (error) {
        //     res.status(500).send(error)
        // }
    }
    //If both Locked, proceed
    if (lockResult_Car && lockResult_Insurance) {
        try {
            let changeOwnerTransaction = await contract_car.evaluateTransaction('changeCarOwnerLocked', req.body.carID, req.body.carOwner, hashPassPhrase(secrets_insurance.secret), 'assetCollection')
            let changeOwnerInsurance = await contract_insurance.evaluateTransaction('changeInsuranceOwner', req.body.carID, req.body.carOwner)
        } catch (err) {
            res.status(500).send({status: 500, message: "Failed to Change OwnerShip"})
        }

        const result_Org1 = await contract_car.evaluateTransaction('removeHashLock', 'assetCollection', req.body.carID);
        const result_Org2 = await contract_car.evaluateTransaction('removeHashLock', 'assetCollection', req.body.carID);
        res.status(200).send({status: 200, message: "Failed to Change OwnerShip"})
    }
    res.status(500).send({status: 500, message: "Transaction Failed"})
})

router.post('/api/addcarwithinsurance', async function (req, res) {
    //Second Sample
    try {

        const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser3');
        if (!identity) {
            console.log('An identity for the user "appUser3" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser3', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        var data = res.json
        await contract.submitTransaction('createCar', req.body.carID, req.body.carModel, req.body.carOwner, req.body.carInsurance);
        // await contract.submitTransaction('createCar', 'CAR332', 'kia', '2025', 'Black', 'Talha');

        console.log('Transaction has been submitted');
        // res.send('Transaction has been submitted CAR ADDED');
        // Disconnect from the gateway.
        await gateway.disconnect();
        //First Sample
        try {

            const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
            // Create a new file system based wallet for managing identities.
            const walletPath = path.resolve(__dirname, '..', '..', '..', 'fabcar', 'javascript', 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
            var data = res.json
            await contract.submitTransaction('createCar', req.body.carID, req.body.carMake, req.body.carModel, req.body.carColor, req.body.carOwner);
            // await contract.submitTransaction('createCar', 'CAR332', 'kia', '2025', 'Black', 'Talha');

            console.log('Transaction has been submitted');
            // res.send('Transaction has been submitted CAR ADDED');
            // Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
        res.send('Transaction has been submitted CAR ADDED');
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
    //First Sample

})

router.get('/api/allcarinsurances', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', '..', 'secondSample', 'fabric-samples', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser3');
        if (!identity) {
            console.log('An identity for the user "appUser3" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser3', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(JSON.parse(result));
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // res.render("allcars", { list: JSON.parse(result) });
        res.send(JSON.parse(result))
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});

router.get('/api/getContract', async function (req, res){
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '..', '..', '..', 'fabcar', 'javascript', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        let result = await contract.createTransaction('org.hyperledger.fabric:GetMetadata')
        const metadata = JSON.parse((await result.evaluate()).toString());

        // res.render("allcars", { list: JSON.parse(result) });
        res.status(200).send(metadata)
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});

module.exports = router