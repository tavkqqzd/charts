import React from "react";
import "../../View/Styles/Dashboard.scss";
import ReactApexChart from "react-apexcharts";

const BarChart = props => {
  return (
    <div>
      <h4 className="chartLabel text-center mt-2">Devices Frequency Distribution</h4>
      <ReactApexChart options={props.options} series={props.series} type="bar" height="350" />
    </div>
  );
};

export default BarChart;
