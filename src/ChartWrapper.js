import React, {Component} from 'react';
import Chart from 'chart.js'
import { buildData, buildOptions } from './ChartUtils'

class GraphWrapper extends Component {

    componentDidMount() {

        var ctx = this.refs.chart.getContext("2d");
        const { theme,start,end } = this.props

        this.chart = new Chart(this.refs.chart, {
            type: 'line',
            data: buildData(theme,ctx),
            options: buildOptions(theme,start,end)
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.start !== this.props.start || prevProps.end !== this.props.end){
            this.chart.options.scales.xAxes[0].time.min = this.props.start
            this.chart.options.scales.xAxes[0].time.max = this.props.end
            
            this.chart.update()
        }
        

    }

    componentWillUnmount(){
        if(this.chart){
            this.chart.destroy()
        }
    }

    render() {
        return (
            <canvas
                ref='chart'
                height={300}>
            </canvas>
        )
    }
}

export default GraphWrapper
