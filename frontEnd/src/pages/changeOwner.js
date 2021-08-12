import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import {toast} from 'react-toastify'
const crypto = require('crypto')

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

export default function ChangeCarOwner() {
    const classes = useStyles();

    //States
    const [carID, setCarID] = React.useState('')
    const [newOwner, setNewOwner] = React.useState('')
    const [passPhrase, setPassPhrase] = React.useState('')

    //State Handlers
    const handleCarID = (event) => {
        setCarID(event.target.value)
    }

    const handleNewOwner = (event) => {
        setNewOwner(event.target.value)
    }

    const handlePassPhrase = (event) => {
        setPassPhrase(event.target.value)
    }

    const handleSubmit = async () => {
        const apiUrl = `http://localhost:9000/api/changeowner`

        const fetchPromise = fetch(apiUrl, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(allData()),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try {
            const response = await fetchPromise
            const res = await response.json()

            if (res.status == 200) {
                toast.success(`Approved: ${res.message}`)
            } else if(res.status == 403){
                toast.info(`Forbidden: ${res.message}`)
            } else {
                toast.error(`Error!!! ${res.message}`)
            }
            // toast.success('New Car Added')
        } catch (err) {
            toast.error('Error!!! Failed to add Car', err)
        }
    }

    const allData = () => {
        return {
            'carID': carID,
            'carOwner': newOwner,
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
                label="New Car Owner"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    ),
                }}
                onInput={handleNewOwner}
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
