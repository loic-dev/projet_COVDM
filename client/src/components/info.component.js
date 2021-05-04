import Graph from './graph.component'
import {useEffect, Fragment, useState} from 'react'
import '../styles/info.style.css'
import { GENDER, NUMBER_VACCINE, TYPE_VACCIN } from '../constants/info.constant'
import { VACCINATION_CENTER } from '../constants/state.constant'

const Info = ({dataState,typeCenter}) => {


    let init_staticInfo = {
        age:0,
        totH:0,
        totF:0,
        totDose:0,
        totDose1:0,
        totDose2:0,
        moderna:0,
        astraZeneca:0,
        pfizer:0,
        positif:0,
        negatif:0
    }

  

    const [staticInfo, setStaticInfo ] = useState(init_staticInfo)
    const [infoDataLoading, setInfoDataLoading] = useState(true)
    const [chartDataSet, setChartDataSet] = useState(null)
    const [chartLabels, setChartLabels] = useState(null)
    const [chartButton, setChartButton] = useState("gender")






    //calcul valeur du graphe
    const chartGenderValue = async () => {

        let jan = new Date(1609459200000);
        let dateNow = Date.now()
        let now = new Date(dateNow)


        let labels1 = []
        let tabMale = []
        let tabFemale = []
        var loop = new Date(jan);
        while(loop <= now){          
            var newDate = loop.setDate(loop.getDate() + 7);
            loop = new Date(newDate);
            labels1.push(loop)
            var male1 = 0;
            var female1 = 0;
            dataState.forEach(element => {
                let date = new Date(element.dateVaccination)
                if(date.toDateString() === loop.toDateString()){
                    if(element.gender === "male"){
                        male1 +=1;
                    } else {
                        female1 +=1;
                    }
                } 
            });
            tabMale.push(male1)
            tabFemale.push(female1)
        }

       /* console.log(labels1)
        console.log(tabMale)
        console.log(tabFemale)*/

        
        let male = {
            label: 'homme',
            data: tabMale,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }

        let female = {
            label: 'femme',
            data: tabFemale,
            fill: false,
            borderColor: 'rgb(201, 42, 233)',
            tension: 0.1
        }

        let dataSet = [male,female]
        let labels = labels1

        setChartDataSet(dataSet)
        setChartLabels(labels)
    }



    const chartTypeVaccin = async () => {
        let astraZeneca = {
            label: 'AstraZeneca',
            data: [0,1,3,5,10],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }

        let pfizer = {
            label: 'Pfizer',
            data: [10,15,12,14,22],
            fill: false,
            borderColor: 'rgb(201, 42, 233)',
            tension: 0.1
        }

        let moderna = {
            label: 'Moderna',
            data: [8,8,13,22,25],
            fill: false,
            borderColor: 'rgb(80, 233, 42)',
            tension: 0.1
        }

        let dataSet = [astraZeneca,pfizer,moderna]
        let labels = ["1 janvier","2 janvier","3 janvier", "4 janvier", "5 janvier"]

        setChartDataSet(dataSet)
        setChartLabels(labels)
    }

    const numberVaccine = async () => {
        let number = {
            label: 'Nombre de vacciné',
            data: [35,52,10,35,5],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
        let dataSet = [number]
        let labels = ["1 janvier","2 janvier","3 janvier", "4 janvier", "5 janvier"]

        setChartDataSet(dataSet)
        setChartLabels(labels)
    }


    //controller bouton graphe
    useEffect(async () => {
        switch (chartButton) {
            case GENDER:
                await chartGenderValue()
                break;
            case TYPE_VACCIN:
                await chartTypeVaccin()
                break;
            case NUMBER_VACCINE:
                await numberVaccine()
                break;
            default:
                break;
        }
    }, [chartButton,dataState])


    //controlleur donnée statique
    useEffect(async () => {
        let moyage = 0;
        let homme = 0;
        let femme = 0;
        let dosetotal = 0;
        let dosetot1 = 0;
        let dosetot2 = 0;
        let moderna = 0;
        let astraZeneca = 0;
        let pfizer = 0;
        let positif = 0;
        let negatif = 0;

        for(let i = 0; i<dataState.length; i++){
            moyage += dataState[i].age;

            if(dataState[i].gender === "female"){
                femme +=1
            }
            if(dataState[i].gender === "male"){
                homme +=1
            }

            if(dataState[i].nbDoses === 1){
                dosetotal +=1
                dosetot1 +=1
                
            }
            if(dataState[i].nbDoses === 2){
                dosetotal +=2
                dosetot2 +=1
            }

            if(dataState[i].typeVaccin === "Moderna"){
                moderna +=1
            }
            if(dataState[i].typeVaccin === "AstraZeneca"){
                astraZeneca +=1
            }
            if(dataState[i].typeVaccin === "Pfizer"){
                pfizer +=1
            }

            if(dataState[i].positif === false){
                negatif +=1
            }
            if(dataState[i].positif === true){
                positif +=1
            }

            
        }

        //Affiche + Calcul + Arrondi Âge
        let total = dataState.length;
        let newTotAge = Math.round(moyage/total*10)/10

        setStaticInfo({
            age:newTotAge,
            totH:homme,
            totF:femme,
            totDose:dosetotal,
            totDose1:dosetot1,
            totDose2:dosetot2,
            moderna:moderna,
            astraZeneca:astraZeneca,
            pfizer:pfizer,
            positif,
            negatif
        })

       
    }, [dataState])


    
    
    
    useEffect(() => {
        setInfoDataLoading(true)
    }, [chartButton,dataState])


    useEffect(() => {
        setTimeout(function(){
            setInfoDataLoading(false)
        }, 500);
    }, [staticInfo,chartDataSet])

    return (
        <div>
            <div className="head">
                <h2>Dashboard</h2>
                <div className="swithOption">
                    <span>Nombre de vaccination</span>
                    <span>Répartion Homme/Femme</span>
                    <span>Type de vaccin</span>
                </div>
            </div>
            <div className="contain">
                <div className="tiles mainGraph">
                    <div className="headGraph">
                        <span className="titleGraph">Graphe principal</span>
                    </div>
                    
                    <div className="mainGraphContainer">
                        {infoDataLoading === false && chartDataSet !== null &&  chartLabels !== null && <Graph chartDataSet={chartDataSet} type='line' chartLabels={chartLabels} />}

                    </div>
                </div>
                <div className="containBottom">
                    <div className="tiles secondGraph">
                        <div className="headGraph">
                            <span className="titleGraph">Graphe Secondaire</span>
                        </div>
                        
                        <div className="mainGraphContainer">
                            {infoDataLoading === true ? <p>loading</p> :
                            <Graph chartDataSet={[{
                                                    label: ['homme','femme'],
                                                    data: [staticInfo.totH,staticInfo.totF],
                                                    backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)'],
                                                    borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)'],
                                                    borderWidth: 1
                                                }]} 
                                    type='bar' 
                                    chartLabels={["homme","femme"]} 
                            />
                            
                        
                            }

                        </div>




                    </div>
                    <div className="containBottomLeft">
                        <div className="tiles square first"></div>
                        <div className="tiles square second"></div>


                    </div>

                </div>


            </div>



        










        {/*<Fragment>
            <div className="header">
                <h3>Graphique - France</h3>
                <div className="choiceOption">
                    <input type="button" className={`chartOption ${chartButton === GENDER ? "select" : ""}`} value="Genre" onClick={() => setChartButton(GENDER)}/>
                    <input type="button" className={`chartOption ${chartButton === TYPE_VACCIN ? "select" : ""}`} value="Type de vaccin" onClick={() => setChartButton(TYPE_VACCIN)}/>
                    <input type="button" className={`chartOption ${chartButton === NUMBER_VACCINE ? "select" : ""}`} value="Nombre de vacciné" onClick={() => setChartButton(NUMBER_VACCINE)} />
                </div>
            </div>
            <div className="divChart">
                {infoDataLoading === false && chartDataSet !== null &&  chartLabels !== null && <Graph chartDataSet={chartDataSet} type='line' chartLabels={chartLabels} />}


            </div>
           
            
            <div className="staticInfo">
                <div className="tiles">
                    {infoDataLoading === true ? <p>loading</p> :
                        <Fragment>
                            <Graph chartDataSet={[{
                                                    label: ['homme','femme'],
                                                    data: [staticInfo.totH,staticInfo.totF],
                                                    backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)'],
                                                    borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)'],
                                                    borderWidth: 1
                                                }]} 
                                    type='bar' 
                                    chartLabels={["homme","femme"]} 
                            />
                            {/*typeCenter === VACCINATION_CENTER &&
                                <Fragment>
                                    <p>Nbr total dose administrée / 1ère / 2ème"</p>
                                    <p>{staticInfo.totDose + " / " + staticInfo.totDose1 + " / " + staticInfo.totDose2}</p>
                                </Fragment>
                            }
                        </Fragment>
                    }
                    
                </div>
                <div className="tiles">
                    {infoDataLoading === true ? <p>loading</p> :
                        <Fragment>
                            <h2>Moyenne d'âge des patients</h2>
                            <h4>{staticInfo.age}</h4>
                        </Fragment>
                    }
                    
                </div>
                {/*<div className="tiles">
                    {typeCenter === VACCINATION_CENTER ?
                            <Fragment>
                               <h2>Vaccin utilisé Moderna / AstraZeneca / Pfizer</h2>
                                <h4>{staticInfo.moderna + " / " + staticInfo.astraZeneca + " / " + staticInfo.pfizer}</h4>
                            </Fragment>
                            :
                            <Fragment>
                               <h2>Test PCR Positif / Négatif</h2>
                                <h4>{staticInfo.positif + " / " + staticInfo.negatif}</h4>
                            </Fragment>

                        }
                    
                    </div>}
            </div>
                        
            </Fragment>*/}
        </div>
        
    )
}

export default Info;