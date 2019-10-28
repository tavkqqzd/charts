import React from "react";
import "../../View/Styles/Dashboard.scss";
import ReactApexChart from "react-apexcharts";

const PieChart = props => {
  return (
    <div className="h-100">
      <h4 className="chartLabel text-center mt-2">Devices Frequency Distribution</h4>
      <div className="d-flex h-100 align-items-center justify-content-center">
        <ReactApexChart
          options={props.options}
          series={props.userFreqPieChart}
          type="donut"
          width="330"
          height="330"
        />
      </div>
    </div>
  );
};

export default PieChart;
