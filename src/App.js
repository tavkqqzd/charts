import React from "react";
import LoginPage from "./App/View/Login/Login";
import { Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./App/View/Dashboard/Dashboard";

export default function App() {
  return (
    <div style={{backgroundColor: '#f8f8f8'}}>
      <BrowserRouter>
        <Route exact path="/" exact component={LoginPage} />
        <Route exact path="/dashboard" component={Dashboard} />
      </BrowserRouter>
    </div>
  );
}
