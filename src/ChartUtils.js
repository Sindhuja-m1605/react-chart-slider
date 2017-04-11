import moment from 'moment'

const colors = {
    light: {
        fontColor: "#2c3e50",
        strokeColor: "rgba(44,62,80,1)",
        fillColorUpper: "rgba(44,62,80,1)",
        fillColorLower: "rgba(44,62,80,0)",
        lineColor: "#dddddd",
        pointColor: "#f5a623",
        pointBorderColor: "rgba(44,62,80,1)"
    },
    dark: {
        fontColor: "rgba(255, 255, 255, 0.7)",
        strokeColor: "rgba(30,215,96,1)",
        fillColorUpper: "rgba(30,215,96,0.7)",
        fillColorLower: "rgba(25,24,24,0)",
        lineColor: "rgba(255, 255, 255, 0.4)",
        pointColor: "#ffffff",
        pointBorderColor: "rgba(44,62,80,1)"
    }
}

function genData(){
    let now = new Date()
    let delta = 300*60*1000
    let start = now - delta
    const interval = 10000
    let points = delta/interval
    let data = []
    for(let i=0;i<points;i++){
        data.push({
            x: start + i*interval,
            y: Math.floor(Math.random()*10)
        })
    }
    return data
}

export function buildData(style,ctx){
    const theme = colors[style]

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, theme.fillColorUpper);
    gradient.addColorStop(1, theme.fillColorLower);

    let label = "test data"

    let data = {
        datasets: [
            {
                label: label,
                fill: true,
                lineTension: 0,
                backgroundColor: gradient,
                borderWidth: 1,
                borderColor: theme.strokeColor,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: theme.pointColor,
                pointHoverBorderColor: theme.pointBorderColor,
                pointHoverBorderWidth: 2,
                data: genData()
            }
        ]
    }
    return data
}

export function buildOptions(style){
    const theme = colors[style]
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false,
        },
        animation: false,
        legend: {
            display: false,
        },
        tooltips: {
            cornerRadius: 2,
            displayColors: false,
            backgroundColor: 'rgba(0,0,0,0.7)',
            callbacks: {
                label: function (tooltipItem, datasets) {
                    return datasets.datasets[tooltipItem.datasetIndex].label + ': ' +
                        Intl.NumberFormat().format(tooltipItem.yLabel.toFixed(2))
                },
                title: function (tooltipItem, datasets) {
                    return moment(tooltipItem[0].xLabel).format("hh:mm:ss")
                }
            }
        },
        hover: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            xAxes: [{
                type: "time",
                gridLines: {
                    display: false,
                },
                scaleLabel: {
                    display: true
                },
                ticks: {
                    maxRotation: 0,
                    fontColor: theme.fontColor,
                    autoSkip: true,
                    autoSkipPadding: 35
                },
                time: {
                    displayFormats: {
                        'millisecond': 'HH:mm:ss.SSS',
                        'second': 'HH:mm:ss',
                        'minute': 'HH:mm:ss',
                        'hour': 'HH:mm',
                        'day': 'DD:HH:mm',
                        'week': 'DD:HH:mm',
                        'month': 'DD:HH:mm',
                        'quarter': 'DD:HH:mm',
                        'year': 'DD:HH:mm',
                    }
                },
            }],
            yAxes: [{
                type: 'linear',
                ticks: {
                    maxTicksLimit: 6,
                    suggestedMin: 0,
                    fontColor: theme.fontColor,
                    callback: function (value, index, values) {
                        return value > 999999 ? (value / 1000000).toFixed(0) + 'M' : (value > 999 ? (value / 1000).toFixed(0) + 'K' : value)
                    }
                },
                maxTicksLimit: 6,
                scaleLabel: {
                    display: false
                },
                gridLines: {
                    display: true,
                    color: theme.lineColor,
                    lineWidth: 1,
                },
            }]
        }
    }
    return options
}