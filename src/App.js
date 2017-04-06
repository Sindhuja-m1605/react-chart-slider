import React, { Component } from 'react';
import Slider from './Slider'

import './App.css'

class App extends Component {

  constructor(){
    super()
    this.state = {
      start: 1,
      end: 3
    }
  }

  onRangeChange(params){
    this.setState({
      start: params.start,
      end: params.end
    })
  }

  render() {
    const {start,end} = this.state
    return (
      <div className='container'>
        <div>
          <p>Start: {start.toFixed(2)} </p>
          <p>End: {end.toFixed(2)}</p>
        </div>
        <Slider min={0} max={10} minRange={1} start={1} end={3} onRangeChange={this.onRangeChange.bind(this)}/>
      </div>
    );
  }
}

export default App;
