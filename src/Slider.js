import React, { Component } from 'react';

class Slider extends Component {

  constructor() {
    super()
    this.state = {
      min: 0,
      max: 10,
      start: 3,
      end: 5,
      width: 0
    }

    this.handleResize = this.handleResize.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  move(position){

  }

  handleMouseDown(e){
    let position = [e.pageX,e.pageY]
    document.addEventListener('mousemove',this.handleMouseMove,false)
    document.addEventListener('mouseup',this.handleMouseUp,false)
  }

  handleMouseUp(e){
    let position = [e.pageX,e.pageY]
    document.removeEventListener('mousemove',this.handleMouseMove,false)
    document.removeEventListener('mouseup',this.handleMouseUp,false)
  }

  handleMouseMove(e){
    let position = [e.pageX,e.pageY]
    this.move(position[0])
  }

  calcOffset(value) {
    const { max, min } = this.state
    let range = max - min
    if (range === 0) {
      return 0
    }
    let ratio = (value - min) / range
    return ratio * this.state.width
  }

  handleResize() {
    setTimeout(() => {
      let slider = this.refs.slider
      let rect = slider.getBoundingClientRect();

      this.setState({
        width: rect.width
      })
    }, 0)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  }

  buildHandleStyle(offset, i) {
    let style = {
      position: 'absolute',
      willChange: 'left',
      zIndex: i+1,
      left: offset,
    }
    return style
  }

  renderHandles(handles,offset) {
    return handles.map((handle, i) => {
      const key = 'handle' + i
      return <div ref={key}
        key={key}
        style={this.buildHandleStyle(offset[i]-10,i)}
        className='handle'
        onMouseDown={this.handleMouseDown}></div>
    })
  }

  buildBarStyle(min,max){
    return {
      position: 'absolute',
      willChange: 'left, right',
      left: min,
      right: max
    }
  }

  renderBar(offset) {
    const min = offset[0]
    const max = this.state.width - offset[1] 
    return <div style={this.buildBarStyle(min,max)}
      className='bar'></div>
  }

  render() {
    const {start, end} = this.state
    let handles = ['start', 'end']
    let offset = [this.calcOffset(start),this.calcOffset(end)]
    return (
      <div ref='slider' className={'slider'}>
        {this.renderHandles(handles,offset)}
        {this.renderBar(offset)}
      </div>

    );
  }
}

export default Slider;
