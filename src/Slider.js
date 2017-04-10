import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import moment from 'moment'


const HANDLE_WIDTH = 10
const SLIDER_BTN_WIDTH = 27 + (HANDLE_WIDTH/2)

class Slider extends Component {

  constructor(props) {
    super(props)
    const {start,end } = this.props
    this.state = {
      start,
      end,
      width: 0,
      left: 0,
      target: null
    }

    this.handleResize = this.handleResize.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.getTetherRef = this.getTetherRef.bind(this)
    this.tethers = []
  }

  pauseEvent(e){
    if(e.stopPropagation){
      e.stopPropagation()
    }
    if(e.preventDefault){
      e.preventDefault()
    }
  }

  getNextValue(mouseX){
    const { left, width } = this.state
    const { min, max } = this.props
    const range = max - min
    if(width === 0){
      return 0
    }
    let ratio = (mouseX - left)/width
    ratio = ratio > 1 ? 1 : ratio
    ratio = ratio < 0 ? 0 : ratio
    return ratio*range + min
  }

  moveEnd(mouseX){
    const { max, minRange } = this.props
    const { start } = this.state
    const lowerBound = start + minRange
    let next = this.getNextValue(mouseX)
    next = next > max ? max : next
    next = next < lowerBound ? lowerBound : next
    this.setState({
      end: next
    })
  }

  moveStart(mouseX){
    const { min, minRange } = this.props
    const { end } = this.state
    const higherBound = end - minRange
    let next = this.getNextValue(mouseX)
    next = next < min ? min : next
    next = next > higherBound ? higherBound : next
    this.setState({
      start: next,
    })
  }

  moveBar(mouseX){
    const {width,start,end} = this.state
    const {min,max} = this.props

    let offset = mouseX - this.state.mouseX
    const range = max - min

    if(width === 0){
      return 0
    }
    const delta = (offset/width)*range

    const currentRange = end - start
    const lowerBound = min + currentRange
    const upperBound = max - currentRange
    let nextStart = start + delta
    let nextEnd = end + delta
    nextStart = nextStart < min ? min : nextStart
    nextStart = nextStart > upperBound ? upperBound : nextStart
    nextEnd = nextEnd > max ? max : nextEnd
    nextEnd = nextEnd < lowerBound ? lowerBound : nextEnd

    this.setState({
      mouseX,
      start: nextStart,
      end: nextEnd
    })

  }

  start(e,target){
    this.setState({
      mouseX: e.pageX,
      target,
    })
    this.fireEvent('onRangeChangeStart')
  }

  end(){
    this.setState({
      target: null,
      mouseX: undefined
    })
    this.fireEvent('onRangeChangeEnd')
  }

  handleMouseDown(e, target){
    this.start(e,target)
    document.addEventListener('mousemove',this.handleMouseMove,false)
    document.addEventListener('mouseup',this.handleMouseUp,false)
    this.pauseEvent(e)
  }

  handleMouseUp(e){
    this.end()
    document.removeEventListener('mousemove',this.handleMouseMove,false)
    document.removeEventListener('mouseup',this.handleMouseUp,false)
    this.pauseEvent(e)
  }

  fireEvent(event){
    const e = this.props[event]
    const {start,end} = this.state
    if(e) e({start,end})
  }

  handleMouseMove(e){
    const mouseX = e.pageX
    const target = this.state.target
    this.pauseEvent(e)
    switch(target){
      case 'handle0':
        this.moveStart(mouseX)
        break
      case 'handle1':
        this.moveEnd(mouseX)
        break
      case 'bar':
        this.moveBar(mouseX)
        break
      default:
        throw new Error('Unknown move target '+target)
    }
    this.fireEvent('onRangeChange')
  }

  calcOffset(value) {
    const { max, min } = this.props
    let range = max - min
    if (range === 0) {
      return 0
    }
    let ratio = (value - min) / range
    return ratio * (this.state.width)
  }

  handleResize() {
    setTimeout(() => {
      let slider = this.refs.slider
      let rect = slider.getBoundingClientRect();

      this.setState({
        width: rect.width - SLIDER_BTN_WIDTH,
        left: rect.left
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

  getTetherRef(t){
    this.tethers.push(t)
  }

  renderHandles(handles,offset) {
    return handles.map((value, i) => {
      const key = 'handle' + i
      return [<div
        id={key}
        key={key}
        style={this.buildHandleStyle(offset[i] - (HANDLE_WIDTH/2),i)}
        className='handle'
        onMouseDown={ (e) => this.handleMouseDown(e,key) }>

        </div>,
        <Tooltip
          placement="top"
          isOpen={true}
          target={key}
          tetherRef={this.getTetherRef}>
          {moment(value).format("HH:mm:ss")}
        </Tooltip>
        ]
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
    const max = this.state.width - offset[1] + SLIDER_BTN_WIDTH
    return <div style={this.buildBarStyle(min,max)}
      className='bar'
      ref='bar'
      onMouseDown={(e) => this.handleMouseDown(e,'bar')}></div>
  }

  renderSliderBtn(){
    return (
      <div className="slider-btn">
        &raquo;
      </div>
    )
  }

  componentDidUpdate(){
    const tethers = this.tethers
    setTimeout(function () {
        tethers.forEach((t) => {
          t.position()
        })
    }, 0)
  }

  componentWillReceiveProps(nextProps){
    if(this.props.start != nextProps.start || this.props.end != nextProps.end){
      this.setState({
        start: nextProps.start,
        end: nextProps.end
      })
    }
  }

  render() {
    const {start, end} = this.state
    let handles = [start, end]
    let offset = [this.calcOffset(start),this.calcOffset(end)]
    
    return (
        <div ref='slider' className={'slider'}>
          {this.renderHandles(handles,offset)}
          {this.renderBar(offset)}
          {this.renderSliderBtn()}
        </div>
    )
  }
}

export default Slider;
