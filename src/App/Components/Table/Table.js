import React from "react";
import "../../View/Styles/Dashboard.scss";

const Table = props => {
  return (
    <div>
      <h4 className="chartLabelworld text-center mt-2">Country Wise Users Frequency</h4>
      <div className="tableFixHead">
        <table>
          <thead>
            <tr className="table_tr">
              <th className="table_tr_header">Country</th>
              <th className="table_tr_header">User</th>
              <th className="table_tr_header">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {!!props.getUsersFrequencyCountryWiseData &&
              props.getUsersFrequencyCountryWiseData.values.map(data => (
                <tr className="table_tr" key={data.index}>
                  <td className="table_td">{data.index}</td>
                  <td className="table_td">{data.country}</td>
                  <td className="table_td">{parseFloat(data.percentage).toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
