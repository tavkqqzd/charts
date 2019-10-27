import React from "react";
import cookie from "react-cookies";
import {GetUsersFrequency} from '../../Network/api'
import '../Styles/Dashboard.scss'

class Dashboard extends React.Component {
  state = {
    usersFreq: ''
  }
  componentDidMount() {
    let token = cookie.load('token')
    if(token === undefined || token === '' || token === null || token.length < 10) {
      this.props.history.push('/')
    }
    GetUsersFrequency(token).then(res => {
      this.setState({usersFreq: res.data[0]})
    }).catch(err => console.log('err', err))
  }
  render() {
    let {usersFreq} = this.state
    return (
      <div className="col-12" style={{ height: "100vh" }}>
        <div className="row">
          <div className="col-2">
          {!!usersFreq && usersFreq.values.map(k => (
              <div  
              key={k.textCode}
              // style={this.state.activeTextCode === data.textCode ? this.state.styles : {}}
              className="col-10 text-center"
              // onClick={this.handledata.bind(this, k)}
            >
              <h6>{k.value}</h6>
              <p>{k.label}</p>
            </div>
          ))}
          </div>
          <div className="col-10"></div>

        </div>
      </div>
    );
  }
}

export default Dashboard;
