import "../styles/graph.style.css"
import {useEffect, createRef, useState} from 'react'
import {Chart, ChartConfiguration, Tooltip, DateAdapter, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement,LinearScale, Title, Legend, TimeScale, TimeSeriesScale} from 'chart.js' 
import 'chartjs-adapter-moment';
const GraphSecond = ({chartDataSet, chartLabels,type}) => {

    const chartSecondRef = createRef();

    const [chartSecond, setChartSecond] = useState(null)
    

    useEffect(() => {
        if(chartSecond !== null){
            chartSecond.data.labels = chartLabels;
            chartSecond.data.datasets = chartDataSet;
            chartSecond.update();
        }
        
    }, [chartDataSet,chartLabels])
    

    useEffect(() => {
        const myChartSecondRef = chartSecondRef.current.getContext("2d");
        Chart.register(LineController, Tooltip, Legend, CategoryScale,BarController, TimeSeriesScale , TimeScale, LineElement,BarElement, PointElement, LinearScale, Title);

        const graphSecond = new Chart(myChartSecondRef, {
            type:'bar',
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
                animation: {
                    duration: 0
                },
                
            }
        });

        
        setChartSecond(graphSecond)
         
        return () => graphSecond.destroy();    

    }, [])

    return (<canvas  ref={chartSecondRef}></canvas>)


    
}

export default GraphSecond;