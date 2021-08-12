import React from 'react'
    
const carCards = ({ carList }) => {
  return (
    <div>
      <center><h1>List of Cars on Ledger</h1></center>
      {carList.map((car) => (
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">{car.Key}</h3>
            <h5 class="card-subtitle mb-2 text-muted">{car.Record.owner}</h5>
            <h5 class="card-text">{car.Record.make}</h5>
            <h5 class="card-text">{car.Record.model}</h5>
            <h5 class="card-text">{car.Record.color}</h5>
            <h5 class="card-text">{car.Record.insurance}</h5>
          </div>
        </div>
      ))}
    </div>
  )
};

export default carCards