import React from "react";
import cookie from "react-cookies";
import {
  GetUsersFrequency,
  GetUsersFrequencyCountryWise,
  GetUsersUsersDeviceCountryWise
} from "../../Network/api";
import "../Styles/Dashboard.scss";
import Chart from "react-apexcharts";
import Map from "../../Components/Map/Map";
import Table from "../../Components/Table/Table";
import DeviceTable from "../../Components/DeviceTable/DeviceTable";
import ReactApexChart from "react-apexcharts";

const { getName } = require("country-list");

class Dashboard extends React.Component {
  state = {
    usersFreq: "",
    token: "",
    getUsersFrequencyCountryWiseData: "",
    getUsersDeviceCountryWiseData: "",
    countriesCodesArray: [],
    countriesNamesArray: [],
    WorldUserdata: "",
    optionsBarChart: {},
    chartData: null,
    userFreqPieChart: "",

    options: {
      noData: {
        text: "No data available"
      },
      dataLabels: {
        enabled: true
      },
      labels: [],
      responsive: [
        {
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }
  };
  componentDidMount() {
    let token = cookie.load("token");
    this.setState({ token: token });
    if (token === undefined || token === "" || token === null || token.length < 10) {
      this.props.history.push("/");
    }
    GetUsersFrequency(token)
      .then(res => {
        this.setState({
          usersFreq: res.data[0],
          userFreqPieChart: this.createNewArrayToRender(res.data[0].values)
        });
      })
      .catch(err => console.log("err", err));
  }

  createNewArrayToRender = arr => {
    let arrayToPush = [];
    let object = {};
    arr.map(
      k => (
        (object = {}),
        (object["label"] = k.label),
        (object["y"] = k.value),
        arrayToPush.push(object)
      )
    );
    let ar = arrayToPush.map(k => k.y);
    let lab = arr.map(k => k.label);
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        labels: lab
      }
    }));
    return ar;
  };

  GetUsersFrequencyCountryWise = (token, textCode) => {
    GetUsersFrequencyCountryWise(token, textCode)
      .then(res => {
        this.setState({ getUsersFrequencyCountryWiseData: res.data[0] }, () => {
          this.GetUsersUsersDeviceCountryWise(token);
        });
      })
      .catch(err => console.log("err", err));
  };

  GetUsersUsersDeviceCountryWise = token => {
    GetUsersUsersDeviceCountryWise(token)
      .then(res => {
        console.log("res.data[0]", res.data[0]);
        this.setState({ getUsersDeviceCountryWiseData: res.data[0] }, () => {});
      })
      .catch(err => console.log("err", err));
  };

  /** map methods start */
  makeMapDataStructure = () => {
    const { countriesCodesArray } = this.state;
    let obj = {};
    countriesCodesArray.forEach(countryCode => (obj[countryCode] = 5));
    this.setState({
      data: obj
    });
  };

  getCountriesNamesList = () => {
    const { countriesCodesArray } = this.state;
    const list = countriesCodesArray.map(code => getName(code));
    this.setState(
      {
        countriesNamesArray: list
      },
      () => this.makeMapDataStructure()
    );
  };

  handleClick = (e, countryCode) => {
    const { countriesCodesArray } = this.state;
    if (countriesCodesArray.indexOf(countryCode) === -1) {
      this.setState(
        {
          countriesCodesArray: [...countriesCodesArray, countryCode]
        },
        () => this.getCountriesNamesList()
      );
    }
  };
  /** map methods end */

  render() {
    let {
      usersFreq,
      token,
      getUsersFrequencyCountryWiseData,
      getUsersDeviceCountryWiseData
    } = this.state;
    let UserFreq = this.state.usersFreq && this.state.usersFreq.values;
    return (
      <div className="col-12" style={{ height: "100vh" }}>
        <div className="row">
          <div className="col-2 barchart_box">
            {!!usersFreq &&
              usersFreq.values.map(k => (
                <div
                  key={k.textCode}
                  // style={this.state.activeTextCode === data.textCode ? this.state.styles : {}}
                  className="col-10 text-center"
                  onClick={() => this.GetUsersFrequencyCountryWise(token, k.textCode)}
                >
                  <h6>{k.value}</h6>
                  <p>{k.label}</p>
                </div>
              ))}
          </div>
          <div className="col-10">
            <div className="row">
              <div className="col-4 rf_box_w_elevation">
                <h4 className="chartLabel text-center mt-2">Devices Frequency Distribution</h4>
                <div className="d-flex align-items-center justify-content-center">
                  <ReactApexChart
                    options={this.state.options}
                    series={this.state.userFreqPieChart}
                    type="donut"
                    width="330"
                    height="330"
                  />
                </div>
              </div>
              <div className="col-4 rf_box_w_elevation">
                <DeviceTable getUsersDeviceCountryWiseData={getUsersDeviceCountryWiseData} />
              </div>
              <div className="col-4 rf_box_w_elevation">
                <h4 className="chartLabel text-center mt-2">Devices Frequency Distribution</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-8 rf_box_w_elevation">
                <Map getUsersFrequencyCountryWiseData={getUsersFrequencyCountryWiseData} />
              </div>

              <div className="col-4 text-center rf_box_w_elevation">
                <Table getUsersFrequencyCountryWiseData={getUsersFrequencyCountryWiseData} />
              </div>
            </div>

            {/* <Chart options={this.state.options} series={this.state.series} type="bar" width="500" /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
