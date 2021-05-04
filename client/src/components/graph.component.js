import "../styles/graph.style.css"
import {useEffect, createRef, useState} from 'react'
import {Chart, ChartConfiguration, Tooltip, DateAdapter, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement,LinearScale, Title, Legend, TimeScale, TimeSeriesScale} from 'chart.js' 
import 'chartjs-adapter-moment';
const Graph = ({chartDataSet, chartLabels,type}) => {

    const chartRef = createRef();

    const [chart, setChart] = useState(null)
    
    useEffect(() => {
        if(chart !== null){
            chart.data.labels = chartLabels;
            chart.data.datasets = chartDataSet;
            chart.update();
        }
        
    }, [chartDataSet,chartLabels])
    

    useEffect(() => {
        const myChartRef = chartRef.current.getContext("2d");
        Chart.register(LineController, Tooltip, Legend, CategoryScale,BarController, TimeSeriesScale , TimeScale, LineElement,BarElement, PointElement, LinearScale, Title);

        const chartCOVDM = new Chart(myChartRef, {
            type,
            data: {
                labels: chartLabels,
                datasets: chartDataSet
            },
            options: {
                responsive:true,
                plugins: {
                    legend: {
                        display: true,
                    }
                },
                scales: type === 'line' ? {
                    x: {
                        type: 'time',
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                
                } : {}
                
            }
        });

        setChart(chartCOVDM)

        return () => chartCOVDM.destroy();    

    }, [])

    return (<canvas id="myChart" ref={chartRef}></canvas>)


    
}

export default Graph;