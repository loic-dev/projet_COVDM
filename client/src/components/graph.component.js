import "../styles/graph.style.css"
import {useEffect, createRef} from 'react'
import {Chart, ChartConfiguration, Tooltip, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement,LinearScale, Title} from 'chart.js' 

const Graph = ({age, totH, totF, totDose, totDose1, totDose2, moderna, astraZeneca, pfizer, positif, negatif}) => {

    const chartRef = createRef();
    
    var val1 = totH;
    var val2 = totF;

    useEffect(() => {
        /* console.log("totalsdbdfbdb= ",totF, totH) */
        const myChartRef = chartRef.current.getContext("2d");
        Chart.register(LineController, Tooltip, CategoryScale,BarController, LineElement,BarElement, PointElement, LinearScale, Title);

        var genre = document.getElementById("buttonGenre");
        var dose = document.getElementById("buttonDose");
        var date = document.getElementById("buttonDate");
        

        genre.onclick = function(evt) {
            const chartCOVDM = new Chart(myChartRef, {
            type: 'bar',
            data: {
                labels: ['Hommes','Femmes'],
                datasets: [{
                    label: '# of Individus',
                    data: [totH,totF],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                        
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)'
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

        return () => chartCOVDM.destroy();    
        }
        /*
        dose.onclick = function(evt) {
            const chartCOVDM = new Chart(myChartRef, {
                type: 'bar',
                data: {
                    labels: ['Hommes','Femmes'],
                    datasets: [{
                        label: '# of Individus',
                        data: [totH,totF],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                            
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)'
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
    
            return () => chartCOVDM.destroy();    
            
        }*/
    
    }, [val1,val2])

    return (<div className="chart">
        
        <div className="chartContainer">
            <canvas id="myChart" ref={chartRef}></canvas>
        </div>
        
    </div>)


    
}

export default Graph;