import React from 'react'
    
const cardInsurance = ({ carInsList }) => {
  return (
    <div>
      <center><h1>List of Cars with insurances</h1></center>
      <table>
          <tr>
            <th>CarID</th>
            <th>Owner</th>
            <th>CarManufacturer</th>
            <th>CarModel</th>
            <th>CarColor</th>
            <th>InsuranceID</th>
          </tr>
        </table>
      {carInsList.map((car) => (
          <table>
          <tr>
            <td>{car.Key}</td>
            <td>{car.Record.owner}</td>
            <td>{car.Record.make}</td>
            <td>{car.Record.model}</td>
            <td>{car.Record.color}</td>
            <td>{car.Record.insurance}</td>
          </tr>
        </table>      
      ))}
    </div>
  )
};

export default cardInsurance;