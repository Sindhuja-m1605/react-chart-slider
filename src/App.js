import React, { Component } from 'react';
import Slider from './Slider'

import './App.css'

let now = new Date()
const initial = {
  min: +now - 60*60*1000,
  max: +now,
  start: +now - 60*30*1000,
  end: +now - 60*15*1000,
}

class App extends Component {

  constructor(){
    super()
    this.state = {
      start: initial.start,
      end: initial.end
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
        <Slider min={initial.min} max={initial.max} minRange={1000} start={initial.start} end={initial.end} onRangeChange={this.onRangeChange.bind(this)}/>
      </div>
    );
  }
}

export default App;
