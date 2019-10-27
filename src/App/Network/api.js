import { IP_ADDRESS } from "./config";

export const Login = (email, password) => {
  return new Promise((resolve, reject) => {
    let data = {
      method: "POST",
      headers: {
        Accept: "application/json",

        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    };
    let status = undefined;
    fetch(`${IP_ADDRESS}/login/`, data)
      .then(res => {
        status = res.status;
        return res.json();
      })
      .then(responseObj => {
        return resolve({ status, data: responseObj });
      })
      .catch(err => {
        console.log(data);
        return reject(err);
      });
  });
};


export const GetUsersFrequency = (token) => {
  return new Promise((resolve, reject) => {
    let data = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": token
      }
    };
    let status = undefined;
    fetch(`${IP_ADDRESS}/usersFrequency/`, data)
      .then(res => {
        status = res.status;
        return res.json();
      })
      .then(responseObj => {
        return resolve({ status, data: responseObj });
      })
      .catch(err => {
        console.log(data);
        return reject(err);
      });
  });
};

