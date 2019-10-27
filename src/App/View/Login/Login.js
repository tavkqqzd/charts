import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Login } from "../../Network/api";
import cookie from "react-cookies";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "inherit"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

class LoginPage extends React.Component {
  state = {
    email: "admin@appscrip.com",
    password: "admin123",
    classes: useStyles
  };

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };
  handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  Login = (e, p) => {
    Login(e, p)
      .then(res => {
        if (res.status === 200) {
          cookie.save("token", res.data.accessToken);
          this.props.history.push('/dashboard')
        } else if (res.status > 399) {
          console.log("you fucked up");
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  };
  render() {
    let { email, password } = this.state;
    let { classes } = this.state;
    console.log(email, password);

    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="col">
   
            <div className="d-flex align-items-center justify-content-center">
              <TextField
                id="filled-email-input"
                label="Email"
                className={classes.textField}
                type="email"
                name="email"
                onChange={this.handleEmail}
                autoComplete="email"
                margin="normal"
                variant="filled"
              />
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <TextField
                id="filled-password-input"
                label="Password"
                onChange={this.handlePassword}
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="filled"
              />
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => this.Login(this.state.email, this.state.password)}
              >
                Login
              </Button>
            </div>
      
        </div>
      </div>
    );
  }
}

export default LoginPage;
