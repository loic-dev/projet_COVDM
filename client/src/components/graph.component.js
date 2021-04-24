import "../styles/graph.style.css"
import {useEffect, createRef} from 'react'
import {Chart, ChartConfiguration, Tooltip, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement,LinearScale, Title} from 'chart.js' 

const Graph = ({dataState}) => {

    const chartRef = createRef();


    useEffect(() => {
        const myChartRef = chartRef.current.getContext("2d");
        Chart.register(LineController, Tooltip, CategoryScale,BarController, LineElement,BarElement, PointElement, LinearScale, Title);
        
        new Chart(myChartRef, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
           
                options: {
                    responsive:true,
                maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
                });

    }, [])

    return (<div className="chart">
        <h3>Graphique - France</h3>
        <div className="choiceOption">
            <input type="button" value="genre"/>
            <input type="button" value="age"/>
            <input type="button" value="date"/>
        </div>
        
        <div className="chartContainer">
            <canvas id="myChart" ref={chartRef}></canvas>
        </div>
        
    </div>)


    
}

export default Graph;