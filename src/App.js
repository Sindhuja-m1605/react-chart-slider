import React, { Component } from 'react';
import { Button, ButtonGroup, Input, Form, FormGroup, Label } from 'reactstrap'
import Slider from './Slider'
import moment from 'moment'
import ChartWrapper from './ChartWrapper'

import './App.css'

let now = new Date()
const initial = {
  min: +now - 480*60*1000,
  max: +now,
  start: +now - 60*30*1000,
  end: +now - 60*15*1000,
  minRange: 5*1000*60
}

class App extends Component {

  constructor(){
    super()
    this.state = {
      start: initial.start,
      end: initial.end,
      from: moment(initial.start).format("HH:mm:ss"),
      to: moment(initial.end).format("HH:mm:ss")
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSetRange = this.handleSetRange.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  onRangeChange(params){
    this.setState({
      start: params.start,
      end: params.end,
      from: moment(params.start).format("HH:mm:ss"),
      to: moment(params.end).format("HH:mm:ss"),
      selectedTime: null,
      error: null,
    })
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  handleButtonClick(time){
    const {min, max} = initial
    let aux = max - time
    aux = aux < min ? min : aux
    this.setState({
      end: max,
      to: moment(max).format("HH:mm:ss"),
      start: aux,
      from: moment(aux).format("HH:mm:ss"),
      selectedTime: time,
    })
  }

  handleSetRange(){
    const {from,to} = this.state
    const {min,max} = initial
    const date = moment().format("YYYY-MM-DD")
    const start = moment(date+' '+from)
    const end = moment(date+' '+to)
    if(!(start.isValid() && end.isValid())){
      this.setState({"error": "Invalid time"})
      return
    }
    if(end.isAfter(moment(max)) || start.isBefore(moment(min))){
      this.setState({"error": "Range out of bounds"})
      return
    }
    const lowerBound = moment(+start+initial.minRange)
    if(lowerBound.isAfter(end)){
      this.setState({"error": "Final time too small"})
      return
    }
    const upperBound = moment(+end-initial.minRange)
    if(upperBound.isBefore(start)){
      this.setState({"error": "Initial time too big"})
      return
    }
    this.setState({
      start,
      end,
      error: null,
      selectedTime: null,
    })
  }

  render() {
    const {start,end,from,to, selectedTime, error} = this.state
    return (
      <div className='container'>
        <div className="clearfix">
          <div className="float-left">
            <Form inline>
              <FormGroup>
                <Label for="input-from" className="inline-form-label"><b>From:</b></Label>
                <Input type="text" name="from" id="input-from"  size="sm" 
                value={from}
                onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="input-to" className="inline-form-label"><b>To:</b></Label>
                <Input  type="text" name="to" id="input-to"  size="sm"
                value={to}
                onChange={this.handleChange} />
              </FormGroup>
              <FormGroup style={{marginLeft:5}}>
                <Button color="secondary" size="sm" className="range-btn" onClick={this.handleSetRange}>Set</Button>
              </FormGroup>
            </Form>
          </div>
          <div className="float-right">
            <b className="inline-form-label">Zoom</b>
            <ButtonGroup>
              <Button color="secondary" size="sm" className="range-btn"
              onClick={()=>{this.handleButtonClick(15*60*1000)}}
              active={selectedTime === 15*60*1000 }>15m</Button>
              <Button color="secondary" size="sm" className="range-btn"
              onClick={()=>{this.handleButtonClick(30*60*1000)}}
              active={selectedTime === 30*60*1000 }>30m</Button>
              <Button color="secondary" size="sm" className="range-btn"
              onClick={()=>{this.handleButtonClick(60*60*1000)}}
              active={selectedTime === 60*60*1000 }>1h</Button>
              <Button color="secondary" size="sm" className="range-btn"
              onClick={()=>{this.handleButtonClick(120*60*1000)}}
              active={selectedTime === 120*60*1000 }>2h</Button>
              <Button color="secondary" size="sm" className="range-btn"
              onClick={()=>{this.handleButtonClick(Number.MAX_SAFE_INTEGER)}}
              active={selectedTime === Number.MAX_SAFE_INTEGER}>All</Button>
            </ButtonGroup>
          </div>
        </div>
        <div>
          <p className="text-danger">{error}</p>
        </div>
        <div className="row">
          <ChartWrapper theme="light"
            start={start} 
            end={end}/>
        </div>
        <div className="row">
          <Slider 
          min={initial.min} 
          max={initial.max} 
          minRange={initial.minRange} 
          start={start} 
          end={end} 
          onRangeChange={this.onRangeChange.bind(this)}/>
        </div> 
      </div>
    );
  }
}

export default App;
