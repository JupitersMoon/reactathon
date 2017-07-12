import React, { Component } from 'react';
import './App.css';
import SpinWheelComponent from './components/spinwheel'

const SpinWheel = new SpinWheelComponent()

class App extends Component {

  componentDidMount() {
    SpinWheel.drawRouletteWheel();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
            <SpinWheelComponent />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}


// MODIFY FOR GIT

export default App;
