import React, { Component } from 'react';
import Cards from '../components/cards'

class allCars extends Component {

    state = {
        carList: []
    }

    getAllCars(){
        const apiUrl = 'http://localhost:9000/api/allcarinsurances'
        fetch(apiUrl)
        .then((res) => res.json())
        .then((data)=> this.setState({carList: data}))
    }

    componentDidMount(){    
        this.getAllCars()
    }

    render() {
        console.log(this.state.carList)
        return (
            <Cards carList={this.state.carList} />
        );
    }
}

export default allCars;