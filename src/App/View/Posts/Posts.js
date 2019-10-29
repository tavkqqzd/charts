import React from "react";
import cookie from "react-cookies";
import {
  GetMainPosts,
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
import PieChart from "../../Components/PieChart/PieChart";
import BarChart from "../../Components/BarChart/BarChart";

var colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#546E7A",
  "#26a69a",
  "#D10CE8"
];
const { getName } = require("country-list");

class Posts extends React.Component {
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
    barChartData: "",
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
    },

    barChartOptions: {
      chart: {
        events: {
          click: function(chart, w, e) {
            console.log(chart, w, e);
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: colors,
            fontSize: "14px"
          }
        }
      }
    },
    series: [
      {
        data: []
      }
    ],
    /** new page */
    typeOfPost: 1,
    mainPosts: "",
    values: "",
    valueTypes: "",
    valuesForValues: "",
    valuesForValuesType: "",
    toDisplayValues: ""
  };
  componentDidMount() {
    let token = cookie.load("token");
    this.setState({ token: token });
    this.getValueOfPosts(token, this.state.typeOfPost);
    if (token === undefined || token === "" || token === null || token.length < 10) {
      this.props.history.push("/");
    }
  }

  getValueOfPosts = (token, typeOfPost) => {
    GetMainPosts(token, typeOfPost)
      .then(res => {
        console.log("GetMainPosts res", res);
        this.setState({
          values: this.createNewArrayToRenderForValues(res.data.values)
        });
      })
      .catch(err => console.log("err", err));
  };

  getStatusOfPosts = (token, typeOfPost) => {
    GetMainPosts(token, typeOfPost)
      .then(res => {
        console.log("GetMainPosts res", res);
        this.setState({
          valueTypes: this.createNewArrayToRenderForValueTypes(res.data.value_types)
        });
      })
      .catch(err => console.log("err", err));
  };

  createNewArrayToRenderForValues = arr => {
    let arrayToPush = [];
    let object = {};
    arr.map(
      k => (
        (object = {}),
        (object["key"] = Object.keys(k)[0]),
        (object["y"] = Object.values(k)[0]),
        (object["typeCode"] = k.typeCode),
        arrayToPush.push(object)
      )
    );
    let extractValues = arrayToPush.map(k => k.y);
    extractValues.shift();
    let lab = arrayToPush.map(k => k.key);
    this.setState({ toDisplayValues: extractValues });
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        labels: lab
      }
    }));
    return arrayToPush;
  };

  createNewArrayToRenderForValueTypes = arr => {
    let arrayToPush = [];
    let object = {};
    arr.map(
      k => (
        (object = {}),
        (object["key"] = Object.keys(k)[0]),
        (object["y"] = Object.values(k)[0]),
        (object["filterType"] = k.typeCode),
        arrayToPush.push(object)
      )
    );
    let extractValues1 = arrayToPush.map(k => k.y);
    extractValues1.shift();
    let lab = arrayToPush.map(k => k.key);
    this.setState({ toDisplayValues: extractValues1 });
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        labels: lab
      }
    }));
    return arrayToPush;
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

        () => {
          this.getCountriesNamesList();
        }
      );
    }
  };
  /** map methods end */

  NavigateToPostsPage = () => {
    this.props.history.push("/posts");
  };

  render() {
    let token = cookie.load("token");
    let { values, valueTypes, toDisplayValues, options, typeOfPost } = this.state;
    return (
      <div className="col-12" style={{ height: "100vh" }}>
        <div className="row">
          <div className="col-2 barchart_box">
            <div id="accordion">
              <div class="card" onClick={() => this.getValueOfPosts(token, typeOfPost)}>
                <div class="card-header" id="headingOne">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Post Types
                    </button>
                  </h5>
                </div>

                <div
                  id="collapseOne"
                  class="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  {!!values &&
                    values.map(k => (
                      <div className="card-body">
                        <div>{k.key}</div>
                        <div>{k.y}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div id="accordion">
              <div class="card" onClick={() => this.getStatusOfPosts(token, typeOfPost)}>
                <div class="card-header" id="headingTwo">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
                    >
                      Post Status
                    </button>
                  </h5>
                </div>

                <div
                  id="collapseTwo"
                  class="collapse show"
                  aria-labelledby="headingTwo"
                  data-parent="#accordion"
                >
                  {!!valueTypes &&
                    valueTypes.map(k => (
                      <div className="card-body">
                        <div>{k.key}</div>
                        <div>{k.y}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-10 mt-5">
            <div className="row">
              <div className="col-4 rf_pie_chart">
                <PieChart options={options} userFreqPieChart={toDisplayValues} />
              </div>
              {/* <div className="col-4 rf_box_w_elevation">
                <DeviceTable getUsersDeviceCountryWiseData={getUsersDeviceCountryWiseData} />
              </div> */}
              {/* <div className="col-4 rf_box_w_elevation">
                <BarChart
                  options={this.state.barChartOptions}
                  series={this.state.series}
                  type="bar"
                  height="350"
                />
              </div> */}
            </div>
            {/* <div className="row">
              <div className="col-8 rf_box_w_elevation">
                <Map getUsersFrequencyCountryWiseData={getUsersFrequencyCountryWiseData} />
              </div>

              <div className="col-4 text-center rf_box_w_elevation">
                <Table getUsersFrequencyCountryWiseData={getUsersFrequencyCountryWiseData} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Posts;
