import React, {Component} from 'react';
import Chart from 'chart.js'
import { buildData, buildOptions } from './ChartUtils'

class GraphWrapper extends Component {

    componentDidMount() {

        var ctx = this.refs.chart.getContext("2d");
        const { theme } = this.props
        
        this.chart = new Chart(this.refs.chart, {
            type: 'line',
            data: buildData(theme,ctx),
            options: buildOptions(theme)
        })
    }

    componentDidUpdate(prevProps, prevState){
        this.chart.update()

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
