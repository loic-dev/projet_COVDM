import Graph from './graph.component'
import GraphSecond from './graphSecond.component'
import {useEffect, Fragment, useState} from 'react'
import '../styles/info.style.css'
import { CAS_POSITIF, GENDER, MAIN_GRAPH_TITLE_CAS_POSITIF, MAIN_GRAPH_TITLE_GENDER, MAIN_GRAPH_TITLE_NUMBER_VACCINE, MAIN_GRAPH_TITLE_TYPE_VACCIN, NUMBER_VACCINE, SECOND_GRAPH_TITLE_VACCIN_GENDER, TYPE_VACCIN, DOSE, SECOND_GRAPH_TITLE_TYPE_VACCIN, SECOND_GRAPH_TITLE_DOSE, SECOND_GRAPH_TITLE_DEPIS_GENDER, SECOND_GRAPH_TITLE_CAS_POSITIF} from '../constants/info.constant'
import { SCREENING_CENTER, VACCINATION_CENTER } from '../constants/state.constant'
import Switcher from './switcher.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faVirus, faSyringe } from '@fortawesome/free-solid-svg-icons'
import Loader from './loader.component'

const Info = ({dataState,typeCenter, switchCenter, infoDataLoading, setInfoDataLoading}) => {


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

    const TYPE_MAIN_GRAPH_VACCIN = [GENDER,TYPE_VACCIN,NUMBER_VACCINE]
    const TYPE_MAIN_GRAPH_DEPIS = [CAS_POSITIF]
    const TYPE_SECOND_GRAPH_VACCIN = [GENDER,TYPE_VACCIN,DOSE]
    const TYPE_SECOND_GRAPH_DEPIS = [GENDER,CAS_POSITIF]




  

    const [staticInfo, setStaticInfo ] = useState(init_staticInfo)
    const [mainGraphLoading, setMainGraphLoading ] = useState(true)
    const [secondaryGraphLoading, setSecondaryGraphLoading] = useState(true)
    const [chartDataSet, setChartDataSet] = useState(null)
    const [chartLabels, setChartLabels] = useState(null)
    const [nameMainGraph, setNameMainGraph] = useState(MAIN_GRAPH_TITLE_GENDER)
    const [nameSecondGraph, setNameSecondGraph] = useState(SECOND_GRAPH_TITLE_VACCIN_GENDER)



    const [chartSecondaryDataSet, setChartSecondaryDataSet] = useState(null)
    const [chartSecondaryLabels, setChartSecondaryLabels] = useState(null)
    const [typeGraphSelect, setTypeGraphSelect] = useState(0)
    const [typeGraphSecondSelect, setTypeGraphSecondSelect] = useState(0)
    const [endAnim, setEndAnim] = useState(false)


    useEffect(() => {
        setTypeGraphSelect(0)
        setTypeGraphSecondSelect(0)
    }, [typeCenter])

    const calculMainGraph = async (type) => {
        const jan = new Date(1609459200000);
        const now = new Date(Date.now());

        var labels = []
        switch (type) {
            case GENDER:
                var tabH = []
                var tabF = []
                break;
            case TYPE_VACCIN:
                var tabPfyser = []
                var tabModerna = []
                var tabAstrazeneca = []
                break;
            case NUMBER_VACCINE:
                var tabNumberVaccine = []
                break;
            case CAS_POSITIF:
                var tabCasPositif = []
                break;
            default:
                break;
        }



        var dateLoop = new Date(jan);
        while(dateLoop <= now){
            var newDate = dateLoop.setDate(dateLoop.getDate() + 7);
            dateLoop = new Date(newDate);
            labels.push(dateLoop);
            switch (type) {
                case GENDER:
                    var homme = 0
                    var femme = 0
                    break;
                case TYPE_VACCIN:
                    var pfizer = 0
                    var moderna = 0
                    var astrazeneca = 0
                    break;
                case NUMBER_VACCINE:
                    var numberVaccine = 0
                    break;
                case CAS_POSITIF:
                    var casPositif = 0
                    break;
                default:
                    break;
            }
            dataState.forEach(data => {
                let date = typeCenter === VACCINATION_CENTER ? new Date(data.dateVaccination) : new Date(data.dateDepistage)
                if(date.toDateString() === dateLoop.toDateString()){
                    switch (type) {
                        case GENDER:
                            if(data.gender === "male"){
                                homme +=1;
                            } else {
                                femme +=1;
                            }
                            break;
                        case TYPE_VACCIN:
                            switch (data.typeVaccin) {
                                case "Moderna":
                                    moderna +=1;
                                    break;
                                case "AstraZeneca":
                                    astrazeneca +=1
                                    break;
                                case "Pfizer":
                                    pfizer += 1
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case NUMBER_VACCINE:
                            numberVaccine += 1
                            break;
                        case CAS_POSITIF:
                            if(data.positif === true){
                                casPositif +=1;
                            }
                            break;
                        default:
                            break;
                    }
                } 
            });
            switch (type) {
                case GENDER:
                    tabH.push(homme)
                    tabF.push(femme)
                    break;
                case TYPE_VACCIN:
                    tabPfyser.push(pfizer)
                    tabModerna.push(moderna)
                    tabAstrazeneca.push(astrazeneca)
                    break;
                case NUMBER_VACCINE:
                    tabNumberVaccine.push(numberVaccine)
                    break;
                case CAS_POSITIF:
                    tabCasPositif.push(casPositif)
                    break;
                default:
                    break;
            }
        }
        switch (type) {
            case GENDER:
                return {tabH,tabF,labels}
            case TYPE_VACCIN:
                return {tabPfyser,tabModerna,tabAstrazeneca,labels}
            case NUMBER_VACCINE:
                return {tabNumberVaccine,labels}
            case CAS_POSITIF:
                return {tabCasPositif,labels}
            default:
                break;
        }
    }

    //calcul valeur du graphe
    const createDataSetToChart = async () => {
        let dataChart = null
        if(typeCenter === SCREENING_CENTER){
            dataChart = await calculMainGraph(TYPE_MAIN_GRAPH_DEPIS[0])
        } else {
            dataChart = await calculMainGraph(TYPE_MAIN_GRAPH_VACCIN[typeGraphSelect])
        }
        if(typeCenter == SCREENING_CENTER){
            let _casPositif = {
                    label: 'Nombre de vaccination',
                    data: dataChart.tabCasPositif,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            setChartDataSet([_casPositif])
            setNameMainGraph(MAIN_GRAPH_TITLE_CAS_POSITIF)
               
        } else {
            switch (TYPE_MAIN_GRAPH_VACCIN[typeGraphSelect]) {
                case GENDER:
                    let male = {
                        label: 'homme',
                        data: dataChart.tabH,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }
            
                    let female = {
                        label: 'femme',
                        data: dataChart.tabF,
                        fill: false,
                        borderColor: 'rgb(201, 42, 233)',
                        tension: 0.1
                    }
                    setChartDataSet([male,female])
                    setNameMainGraph(MAIN_GRAPH_TITLE_GENDER)
                    break;
                case TYPE_VACCIN:
                    let _pfiser = {
                        label: 'Pfiser',
                        data: dataChart.tabPfyser,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }
            
                    let _moderna = {
                        label: 'Moderna',
                        data: dataChart.tabModerna,
                        fill: false,
                        borderColor: 'rgb(201, 42, 233)',
                        tension: 0.1
                    }
    
                    let _astrazeneca = {
                        label: 'Astrazeneca',
                        data: dataChart.tabAstrazeneca,
                        fill: false,
                        borderColor: 'rgb(238, 161, 34)',
                        tension: 0.1
                    }
                    setChartDataSet([_pfiser,_moderna,_astrazeneca])
                    setNameMainGraph(MAIN_GRAPH_TITLE_TYPE_VACCIN)
                    break;
                case NUMBER_VACCINE:
                    let _numberVaccine = {
                        label: 'Nombre de vaccination',
                        data: dataChart.tabNumberVaccine,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }
                    setChartDataSet([_numberVaccine])
                    setNameMainGraph(MAIN_GRAPH_TITLE_NUMBER_VACCINE)
                    break;
                
                default:
                    break;
            }
        }
        



        setChartLabels(dataChart.labels)
    }



    const createDataSetToSecondChart = async () => {
        switch (typeCenter) {
            case VACCINATION_CENTER:
                switch (TYPE_SECOND_GRAPH_VACCIN[typeGraphSecondSelect]) {
                    case GENDER:
                        let __gender_vacc = {
                            label: ['homme','femme'],
                            data: [staticInfo.totH,staticInfo.totF],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)'],
                            borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                        setChartSecondaryDataSet([__gender_vacc])
                        setChartSecondaryLabels( ['homme','femme'])
                        setNameSecondGraph(SECOND_GRAPH_TITLE_VACCIN_GENDER)
                        break;
                    case TYPE_VACCIN:
                        let __type_vacc = {
                            label: ['Pfizer','Moderna','Astrazeneca'],
                            data: [staticInfo.pfizer,staticInfo.moderna,staticInfo.astraZeneca],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(238, 161, 34,0.2)'],
                            borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)','rgb(238, 161, 34)'],
                            borderWidth: 1
                        }
                        setChartSecondaryDataSet([__type_vacc])
                        setChartSecondaryLabels(['Pfizer','Moderna','Astrazeneca'])
                        setNameSecondGraph(SECOND_GRAPH_TITLE_TYPE_VACCIN)
                        break;
                    case DOSE:
                        let __dose = {
                            label: ['1er dose','2eme dose'],
                            data: [staticInfo.totDose1,staticInfo.totDose2],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)'],
                            borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                        setChartSecondaryDataSet([__dose])
                        setChartSecondaryLabels( ['1er dose','2eme dose'])
                        setNameSecondGraph(SECOND_GRAPH_TITLE_DOSE)
                        break;
                    default:
                        break;
                }
                
                break;
            case SCREENING_CENTER:
                switch (TYPE_SECOND_GRAPH_DEPIS[typeGraphSecondSelect]) {
                    case GENDER:
                        let __gender_depis = {
                            label: ['homme','femme'],
                            data: [staticInfo.totH,staticInfo.totF],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)'],
                            borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                        setChartSecondaryDataSet([__gender_depis])
                        setChartSecondaryLabels(['homme','femme'])
                        setNameSecondGraph(SECOND_GRAPH_TITLE_DEPIS_GENDER)
                        break;
                    case CAS_POSITIF:
                        let __cas_positif = {
                            label: ['positif','negatif'],
                            data: [staticInfo.positif,staticInfo.negatif],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)'],
                            borderColor:['rgb(75, 192, 192)','rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                        setChartSecondaryDataSet([__cas_positif])
                        setChartSecondaryLabels(['positif','negatif'])
                        setNameSecondGraph(SECOND_GRAPH_TITLE_CAS_POSITIF)
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    //controller bouton graphe
    useEffect(async () => {
        createDataSetToChart()
    }, [typeGraphSelect,dataState])


    useEffect(() => {
        createDataSetToSecondChart()
    }, [typeGraphSecondSelect,staticInfo,dataState])


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

    const switcherHandler = () => {
        switchCenter()
    }

    const changeTypeGraph = (type) => {
        setMainGraphLoading(true)
        if(type === "plus"){
            setTypeGraphSelect(typeGraphSelect+1)
        } else {
            setTypeGraphSelect(typeGraphSelect-1)
        }
    }

    const changeTypeGraphSecond = (type) => {
        setSecondaryGraphLoading(false)
        if(type === "plus"){
            setTypeGraphSecondSelect(typeGraphSecondSelect+1)
        } else {
            setTypeGraphSecondSelect(typeGraphSecondSelect-1)
        }
    }



    useEffect(() => {
        setTimeout(() => {
            setMainGraphLoading(false)
            setInfoDataLoading(false)
        }, 500);
    }, [chartDataSet])

    useEffect(() => {
        setTimeout(() => {
            setInfoDataLoading(false)
            setSecondaryGraphLoading(false)
        }, 500);
    }, [chartSecondaryDataSet])


    useEffect(() => {
        setTimeout(() => {
            setEndAnim(true)
        }, 900);
    }, [])


    




    return (
        <div>
            {endAnim === true && <Fragment> <div className="head">
                <h2>{typeCenter === VACCINATION_CENTER ? "Statistique de vaccination" : "Statistique de dépistage" }</h2>
                <div className="switcherContainer">
                    <div className="iconSwitcher">
                        <FontAwesomeIcon className="ico"  icon={faSyringe} color="white" />
                    </div>
                    <Switcher typeCenter={typeCenter} switchCenter={switcherHandler.bind(this)}/>
                    <div className="iconSwitcher">
                        <FontAwesomeIcon className="ico" icon={faVirus} color="white" />
                    </div>
                </div>
                
            </div>
            <div className="contain">
             <div className="tiles mainGraph">

             {infoDataLoading === false && mainGraphLoading === false ?

             <Fragment>

                    <div className={`arrow ${typeCenter === VACCINATION_CENTER ? typeGraphSelect === 0 ? "notHover" : "" : "notHover"}`} onClick={() => typeCenter === VACCINATION_CENTER  && typeGraphSelect !== 0 && changeTypeGraph("moins")}>
                        {typeCenter === VACCINATION_CENTER && typeGraphSelect !== 0 && <FontAwesomeIcon className="arrowIcon" style={{marginLeft:'20px'}}  icon={faChevronLeft} />}

                        

                    </div>
                    <div className="containMainGraph">

                        <div className="headGraph">
                            <span className="titleGraph">{nameMainGraph}</span>
                        </div>
                        
                        <div className="mainGraphContainer">
                             <Graph chartDataSet={chartDataSet} type='line' chartLabels={chartLabels} /> 

                        </div>



                    </div>
                    <div className={`arrow  ${typeCenter === VACCINATION_CENTER ? typeGraphSelect === TYPE_MAIN_GRAPH_VACCIN.length-1  ? "notHover" : "" : "notHover"} `} onClick={() => typeCenter === VACCINATION_CENTER && typeGraphSelect !== TYPE_MAIN_GRAPH_VACCIN.length-1  && changeTypeGraph("plus")}>
                    {typeCenter === VACCINATION_CENTER && typeGraphSelect !== TYPE_MAIN_GRAPH_VACCIN.length-1 && <FontAwesomeIcon className="arrowIcon" style={{marginRight:'20px'}} icon={faChevronRight} />}

                    </div> </Fragment> : <Loader type="second"></Loader>}
                    
                </div> 
                <div className="containBottom">
                    <div className="tiles secondGraph">



                    {infoDataLoading === false && secondaryGraphLoading === false ? <Fragment>
                        <div className={`arrow ${typeGraphSecondSelect === 0 ? "notHover" : ""}`} onClick={() => typeGraphSecondSelect !== 0 && changeTypeGraphSecond("moins")}>
                            {typeGraphSecondSelect !== 0 && <FontAwesomeIcon className="arrowIcon" style={{marginLeft:'20px'}}  icon={faChevronLeft} />}
                        </div>
                        <div className="containMainGraph">
                            <div className="headGraph">
                                <span className="titleGraph">{nameSecondGraph}</span>
                            </div>
                            <div className="mainGraphContainer">
                                 <GraphSecond 
                                        chartDataSet={chartSecondaryDataSet} 
                                        type='bar' 
                                        chartLabels={chartSecondaryLabels} />
                                
                            </div>
                        </div>
                        <div className={`arrow ${typeCenter === VACCINATION_CENTER ? typeGraphSecondSelect === TYPE_SECOND_GRAPH_VACCIN.length-1 ? "notHover" : "" : typeGraphSecondSelect === TYPE_SECOND_GRAPH_DEPIS.length-1 ? "notHover" : ""}`} onClick={() =>
                            typeCenter === VACCINATION_CENTER ? typeGraphSecondSelect !== TYPE_SECOND_GRAPH_VACCIN.length-1  && changeTypeGraphSecond("plus") : typeGraphSecondSelect !== TYPE_SECOND_GRAPH_DEPIS.length-1 && changeTypeGraphSecond("plus")}>
                            {typeCenter === VACCINATION_CENTER ? 
                                typeGraphSecondSelect !== TYPE_SECOND_GRAPH_VACCIN.length-1 && <FontAwesomeIcon className="arrowIcon" style={{marginRight:'20px'}}  icon={faChevronRight} />
                            :

                            typeGraphSecondSelect !== TYPE_SECOND_GRAPH_DEPIS.length-1 && <FontAwesomeIcon className="arrowIcon" style={{marginRight:'20px'}}  icon={faChevronRight} />


                            
                            
                             }
                        </div>
                        
                        </Fragment> : <Loader type="second"></Loader>}


                        



                    </div>
                    <div className="containBottomLeft">
                        <div className="tiles square first">
                            {infoDataLoading === true ?
                            
                            <Loader type="second"></Loader>
                            
                            :
                            <Fragment>
                                <div className="headGraph">
                                    <span className="titleGraph">Âge moyen des patients</span>
                                </div>
                                <div className="donnees">
                                    <h2>{staticInfo.age}</h2>
                                </div>

                            </Fragment>}
                           
                        </div>
                        <div className="tiles square second">
                            {infoDataLoading === true ?
                            
                            <Loader type="second"></Loader>
                            
                            :
                            
                            typeCenter === VACCINATION_CENTER ? 
                                <div className="headGraph">
                                    <span className="titleGraph">Nombres de doses utilisées</span>
                                    <div>
                                        <h2>{staticInfo.totDose}</h2>
                                    </div>
                                </div>
                                :
                                <div className="headGraph">
                                    <span className="titleGraph">Taux de positivité des tests</span>
                                    <div>
                                        <h2>{Math.round(100*staticInfo.positif / (staticInfo.positif + staticInfo.negatif)*10)/10} %</h2>
                                    </div>
                                </div>
                            }
                        </div>


                    </div>

                </div>


            </div>



        










            </Fragment>}
        </div>
        
    )
}

export default Info;