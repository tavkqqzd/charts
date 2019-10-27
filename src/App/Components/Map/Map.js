import React from "react";
import { VectorMap } from "react-jvectormap";

class Map extends React.Component {
  render() {
    let Worldmaparr = {};
    this.props.getUsersFrequencyCountryWiseData &&
      this.props.getUsersFrequencyCountryWiseData.values.map(
        data => (Worldmaparr[data.index.match(/[^()]+/g)[1]] = data.country)
      );

    return (
      <VectorMap
        map={"world_mill"}
        backgroundColor="transparent" //change it to ocean blue: #0077be
        zoomOnScroll={false}
        containerStyle={{
          width: "100%",
          height: "345px"
        }}
        onRegionClick={this.handleClick} //gets the country code
        onRegionTipShow={(e, el, code) => {
          let str = Worldmaparr[code] === undefined ? "No Users" : `Users - ${Worldmaparr[code]}`;
          el.html(el.html() + " (" + str + ")");
        }}
        containerClassName="map"
        regionStyle={{
          initial: {
            fill: "#e4e4e4",
            "fill-opacity": 0.9,
            stroke: "none",
            "stroke-width": 0,
            "stroke-opacity": 0
          },
          hover: {
            "fill-opacity": 0.8,
            cursor: "pointer"
          },
          selected: {
            fill: "#146804" //color for the clicked country
          },
          selectedHover: {}
        }}
        regionsSelectable={false}
        series={{
          regions: [
            {
              values: Worldmaparr, //this is your data
              scale: ["#146804"], // your color game's here
              normalizeFunction: "polynomial"
            }
          ]
        }}
      />
    );
  }
}

export default Map;
