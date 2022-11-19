import React, { Component } from "react";
import Home from "../components/Home";

export default function RootLayout(WrappedComponent) {
  return class AdminComponent extends Component {
    render() {
      return (
        <>
          <Home>
            <WrappedComponent {...this.props} />
          </Home>
        </>
      );
    }
  };
}
