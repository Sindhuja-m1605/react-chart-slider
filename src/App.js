import React, { Component } from 'react';
import { Button, ButtonGroup, Input, Form, FormGroup, Label } from 'reactstrap'
import Slider from './Slider'
import moment from 'moment'

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

  handleButtonClick(e){
    
  }

  handleSetRange(e){

  }

  render() {
    const {start,end} = this.state
    return (
      <div className='container'>
        <div className="clearfix">
          <div className="float-left">
            <Form inline>
              <FormGroup>
                <Label for="input-from" className="inline-form-label"><b>From:</b></Label>
                <Input type="text" name="from" id="input-from"  size="sm" value={moment(start).format("HH:mm:ss")} />
              </FormGroup>
              <FormGroup>
                <Label for="input-to" className="inline-form-label"><b>To:</b></Label>
                <Input type="text" name="from" id="input-to"  size="sm" value={moment(end).format("HH:mm:ss")} />
              </FormGroup>
              <FormGroup style={{marginLeft:5}}>
                <Button color="secondary" size="sm" className="range-btn">Set</Button>
              </FormGroup>
            </Form>
          </div>
          <div className="float-right">
            <b className="inline-form-label">Zoom</b>
            <ButtonGroup>
              <Button color="secondary" size="sm" className="range-btn">15m</Button>
              <Button color="secondary" size="sm" className="range-btn">30m</Button>
              <Button color="secondary" size="sm" className="range-btn">1h</Button>
              <Button color="secondary" size="sm" className="range-btn">2h</Button>
              <Button color="secondary" active size="sm" className="range-btn">All</Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="row">
          <Slider 
          min={initial.min} 
          max={initial.max} 
          minRange={5*1000*60} 
          start={initial.start} 
          end={initial.end} 
          onRangeChange={this.onRangeChange.bind(this)}/>
        </div> 
      </div>
    );
  }
}

export default App;
