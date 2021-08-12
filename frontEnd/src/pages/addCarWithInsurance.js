import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

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

    const handleSubmit = () => {
        const apiUrl = 'http://localhost:9000/api/addcarwithinsurance'

        fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(allData()),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => console.log('Data', data))
    }

    const allData = () => {
        return {
            'carID': carID,
            'carColor': carColor,
            'carModel': carModel,
            'carOwner': carOwner,
            'carMake': carMake,
            'carInsurance': carInsurance,
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
