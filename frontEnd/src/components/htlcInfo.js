import React from 'react'
    
const htlcInfo = ({ htlcList }) => {
  return (
    <div>
      <center><h1>List of HTLC on Ledger</h1></center>
      <table>
          <tr>
            <th>CarID</th>
            <th>Receiver</th>
            <th>FirstValid</th>
            <th>LastValid</th>
            <th>Hash</th>
          </tr>
      {htlcList.map((htlc) => (
          <tr>
            <td>{htlc.Key}</td>
            <td>{htlc.Record.receiver}</td>
            <td>{htlc.Record.begin}</td>
            <td>{htlc.Record.end}</td>
            <td>{htlc.Record.hash}</td>     
          </tr>           
      ))}
      </table>  
    </div>
  )
};

export default htlcInfo