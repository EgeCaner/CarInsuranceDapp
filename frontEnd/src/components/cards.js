import React from 'react'
    
const carCards = ({ carList }) => {
  return (
    <div>
      <center><h1>List of Cars on Ledger</h1></center>
      <table>
          <tr>
            <th>CarID</th>
            <th>Owner</th>
            <th>CarManufacturer</th>
            <th>CarModel</th>
            <th>CarColor</th>
            <th>ProdYear</th>
          </tr>
      {carList.map((car) => (
          <tr>
            <td>{car.Key}</td>
            <td>{car.Record.owner}</td>
            <td>{car.Record.make}</td>
            <td>{car.Record.model}</td>
            <td>{car.Record.color}</td>
            <td>{car.Record.year}</td>
          </tr>           
      ))}
      </table>  
    </div>
  )
};

export default carCards