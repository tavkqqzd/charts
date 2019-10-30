import React from "react";
import cookie from "react-cookies";
import { GetMainPosts, GetPostsByCountryFilter } from "../../Network/api";
import "../Styles/Dashboard.scss";
// import Chart from "react-apexcharts";
import Map from "../../Components/Map/Map";
// import Table from "../../Components/Table/Table";
// import DeviceTable from "../../Components/DeviceTable/DeviceTable";
// import ReactApexChart from "react-apexcharts";
import PieChart from "../../Components/PieChart/PieChart";
// import BarChart from "../../Components/BarChart/BarChart";
import PostCountryFilter from "../../Components/Table/PostCountryTable";

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
      plotOptions: {
        pie: {
          size: 70,
          customScale: 1,
          donut: {
            size: "55%"
          }
        }
      },
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
    toDisplayValues: "",
    filterPageCountryData: "",
    setTypeCode: 0,
    applyCss: false,
    filterCode: 0
  };
  componentDidMount() {
    let token = cookie.load("token");
    this.setState({ token: token });
    this.getValueOfPosts(token, this.state.typeOfPost);
    this.GetPostsByCountryFilter(token, 0, 0, 1);
    if (token === undefined || token === "" || token === null || token.length < 10) {
      this.props.history.push("/");
    }
  }

  stringTransform = str => {
    return str.replace(/_/g, " ").toUpperCase();
  };

  /** API Calls happen here */
  getValueOfPosts = (token, typeOfPost) => {
    // this.GetPostsByCountryFilter(token, 0, 0, 1);
    GetMainPosts(token, typeOfPost)
      .then(res => {
        let data = this.createNewArrayToRenderForValues(res.data.values);
        data.shift();
        this.setState({
          values: data
        });
      })
      .catch(err => console.log("err", err));
  };
  /** API Calls happen here */
  getStatusOfPosts = (token, typeOfPost) => {
    GetMainPosts(token, typeOfPost)
      .then(res => {
        let data = this.createNewArrayToRenderForValueTypes(res.data.value_types);
        data.shift();
        this.setState({
          valueTypes: data
        });
      })
      .catch(err => console.log("err", err));
  };

  /** API Calls happen here */
  GetPostsByCountryFilter = (token, filterCode, typeCode, postType) => {
    GetPostsByCountryFilter(token, filterCode, typeCode, postType)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            filterCode: filterCode,
            filterPageCountryData: res.data
          });
        } else if (res.status === 404) {
        } else if (res.status === 500) {
        }
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
    let lab = arrayToPush.map(k => this.stringTransform(k.key));
    lab.shift();
    this.setState({ toDisplayValues: extractValues });
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        labels: lab
      }
    }));
    this.setState(prevState => ({
      barChartOptions: {
        ...prevState.barChartOptions,
        xaxis: {
          ...prevState.barChartOptions.xaxis,
          categories: lab
        }
      },
      series: [
        {
          ...prevState.series[0],
          data: extractValues
        }
      ]
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
        (object["filterType"] = k.filterType),
        arrayToPush.push(object)
      )
    );
    let extractValues1 = arrayToPush.map(k => k.y);
    extractValues1.shift();
    let lab = arrayToPush.map(k => this.stringTransform(k.key));
    lab.shift();
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

  backToDashboard = () => {
    this.props.history.push("/dashboard");
  };

  getTypeCode = typeCode => {
    this.setState({ setTypeCode: typeCode });
  };

  render() {
    let token = cookie.load("token");
    let {
      values,
      valueTypes,
      toDisplayValues,
      options,
      typeOfPost,
      filterPageCountryData
    } = this.state;
    return (
      <div className="col-12" style={{ height: "100vh" }}>
        <div className="row">
          <div className="col-2 barchart_box">
            <div
              className="d-flex"
              onClick={() => this.backToDashboard()}
              style={{ marginTop: "48px", marginLeft: "0px", marginRight: "0px" }}
            >
              <div className="pl-3">
                <img
                  src={require("../../Assets/go-back-left-arrow.png")}
                  style={{ width: "25px", height: "25px" }}
                  alt="left-arrow"
                />
              </div>
              <div className="pl-3 pt-1">DASHBOARD</div>
            </div>
            <div id="accordion" className="p-3 ml-0 mr-0 mb-3">
              <div className="card">
                {/* <div className="card" onClick={() => this.getValueOfPosts(token, typeOfPost)}> */}
                <div
                  className="card-header"
                  id="headingOne"
                  onClick={() => this.GetPostsByCountryFilter(token, 0, 0, 1)}
                >
                  <h5 className="mb-0">
                    <button
                      className="btn btn-default w-100 text-center"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                      onClick={() => this.getValueOfPosts(token, typeOfPost)}
                    >
                      POST TYPES
                    </button>
                  </h5>
                </div>

                <div
                  id="collapseOne"
                  className="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  {!!values &&
                    values.map(k => (
                      <div
                        className="card-body"
                        style={
                          this.state.setTypeCode === k.typeCode
                            ? {
                                backgroundColor: "#0C94B4",
                                color: "#FFF",
                                fontSize: 18,
                                fontWeight: 500
                              }
                            : {}
                        }
                        key={k.key}
                        onClick={() => this.getTypeCode(k.typeCode)}
                      >
                        <div className="text-center">{this.stringTransform(k.key)}</div>
                        <div className="text-center">{k.y}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div id="accordion" className="p-3 ml-0 mr-0">
              <div className="card" onClick={() => this.getStatusOfPosts(token, typeOfPost)}>
                <div className="card-header" id="headingTwo">
                  <h5 className="mb-0">
                    <button
                      className="btn btn-default w-100 text-center"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
                    >
                      POST STATUS
                    </button>
                  </h5>
                </div>

                <div
                  id="collapseTwo"
                  className="collapse show"
                  aria-labelledby="headingTwo"
                  data-parent="#accordion"
                >
                  {!!valueTypes &&
                    valueTypes.map(k => (
                      <div
                        className="card-body"
                        key={k.key}
                        style={
                          this.state.filterCode === k.filterType
                            ? {
                                backgroundColor: "#0C94B4",
                                color: "#FFF",
                                fontSize: 18,
                                fontWeight: 500
                              }
                            : {}
                        }
                        onClick={() =>
                          this.GetPostsByCountryFilter(
                            token,
                            k.filterType,
                            this.state.setTypeCode,
                            this.state.typeOfPost
                          )
                        }
                      >
                        <div className="text-center">{this.stringTransform(k.key)}</div>
                        {/* <div className="text-center">{k.y}</div> */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-10 mt-5">
            <div className="row justify-content-center">
              <div className="col-5 rf_pie_chart">
                <PieChart options={options} userFreqPieChart={toDisplayValues} />
              </div>
              <div className="col-5 rf_box_w_elevation">
                <PostCountryFilter getUsersDeviceCountryWiseData={filterPageCountryData.values} />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-10 rf_box_w_elevation">
                <Map getUsersFrequencyCountryWiseData={filterPageCountryData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Posts;
