import React from "react";
import "../../View/Styles/Dashboard.scss";

const DeviceTable = props => {
  return (
    <div>
      <h4 className="chartLabelworld text-center mt-2">Devices Frequency Distribution</h4>
      <div className="tableFixHead">
        <table>
          <thead>
            <tr className="table_tr">
              <th className="table_tr_header">Device</th>
              <th className="table_tr_header">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {!!props.getUsersDeviceCountryWiseData &&
              props.getUsersDeviceCountryWiseData.values.map(data => (
                <tr className="table_tr" key={data.label}>
                  <td className="table_td" style={{ textAlign: "center" }}>
                    {data.label}
                  </td>
                  <td className="table_td" style={{ textAlign: "center" }}>
                    {parseFloat(data.percentage).toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceTable;
