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
        <SpinWheelComponent />
      </div>

    );
  }
}


// MODIFY FOR GIT

export default App;
