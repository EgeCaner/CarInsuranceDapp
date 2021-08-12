import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core'
import {toast} from 'react-toastify'

const crypto = require('crypto')

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

function hashPassPhrase(passPhrase) {
    const hash = crypto.createHash('sha256')
    hash.update(passPhrase)
    return hash.digest('hex')
}

export default function AddCar() {
    const classes = useStyles();

    //States
    const [carID, setCarID] = React.useState('')
    const [carMake, setCarMake] = React.useState('')
    const [carModel, setCarModel] = React.useState('')
    const [carColor, setCarColor] = React.useState('')
    const [carOwner, setCarOwner] = React.useState('')
    const [passPhrase, setPassPhrase] = React.useState('')

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

    const handlePassPhrase = (event) => {
        setPassPhrase(event.target.value)
    }

    const handleSubmit = async () => {
        const apiUrl = 'http://localhost:9000/api/addcar'
        // console.log(allData())
        const fetchPromise = fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(allData()),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try{
            const response = await fetchPromise
            const res = await response.json()
            
            if(res.status == 200){
                toast.success(`Approved: ${res.message}`)
            }else{
                toast.error(`Error!!! ${res.message}`)
            }
            // toast.success('New Car Added')
        }catch(err){
            toast.error('Error!!! Failed to add Car', err)
        }
    }

    const allData = () => {
        return {
            'carID': carID,
            'carColor': carColor,
            'carModel': carModel,
            'carOwner': carOwner,
            'carMake': carMake,
            'passPhrase': passPhrase,
        }
    }

    return (
        <div>
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
                label="Car Owner"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleCarOwner}
            />
            {/* <TextField
                className={classes.margin}
                id="input-with-icon-textfield"
                label="Secret Pass Phrase"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handlePassPhrase}
            /> */}
            <Button onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
}
