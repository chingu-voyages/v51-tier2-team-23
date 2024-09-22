import React, { Component } from "react";
import "./App.css";
import ParticipantsList from "./components/participantslist";

class App extends Component {
  render() {
    return (
      <main className="container">
        <ParticipantsList />
      </main>
    );
  }
}

export default App;
