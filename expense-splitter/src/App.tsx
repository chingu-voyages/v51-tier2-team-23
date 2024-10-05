import React, { Component } from "react";
import "./App.css";
import GroupDetails from "./components/groupdetails";

class App extends Component {
  render() {
    return (
      <main className="container">
        <GroupDetails />
      </main>
    );
  }
}

export default App;
