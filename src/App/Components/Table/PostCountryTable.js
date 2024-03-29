import React from "react";
import "../../View/Styles/Dashboard.scss";

const PostCountryFilter = props => {
  return (
    <div>
      <h4 className="chartLabelworld text-center mt-2">Country Wise User Frequency List</h4>
      <div className="tableFixHead">
        <table>
          <thead>
            <tr className="table_tr">
              <th className="table_tr_header text-center">Country</th>
              <th className="table_tr_header text-center">Users</th>
              <th className="table_tr_header text-center">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {!!props.getUsersDeviceCountryWiseData &&
              props.getUsersDeviceCountryWiseData.map(data => (
                <tr className="table_tr" key={data.label}>
                  <td className="table_td" style={{ textAlign: "center" }}>
                    {data.index}
                  </td>
                  <td className="table_td" style={{ textAlign: "center" }}>
                    {data.country}
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

export default PostCountryFilter;
