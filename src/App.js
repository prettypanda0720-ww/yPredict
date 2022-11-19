import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import store from "./store";
import Routes from "./routes";
import "./App.css";
import "./styles/index.scss";
import "./styles/styles/responsive.scss";
// import "semantic-ui-css/semantic.min.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Routes childProps={{}} />
        </div>
      </Provider>
    );
  }
}

export default App;