import Graph from './graph.component'
import {useEffect, Fragment, useState} from 'react'
import '../styles/info.style.css'

const Info = ({dataState}) => {

    const [data, setDate] = useState([])
    const [age, setAge] = useState([])
    const [totH, setHomme] = useState([])
    const [totF, setFemme] = useState([])
    const [totDose, setDoseTotal] = useState([])
    const [totDose1, setDose1] = useState([])
    const [totDose2, setDose2] = useState([])
    const [moderna, setModerna] = useState([])
    const [astraZeneca, setAstraZeneca] = useState([])
    const [pfizer, setPfizer] = useState([])
    const [positif, setPositif] = useState([])
    const [negatif, setNegatif] = useState([])

    
    useEffect(() => {
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
            for(let j = 0; j<dataState[i].data.length; j++){
                moyage += dataState[i].data[j].age;

                if(dataState[i].data[j].gender === "female"){
                    femme +=1
                }
                if(dataState[i].data[j].gender === "male"){
                    homme +=1
                }

                if(dataState[i].data[j].nbDoses === 1){
                    dosetotal +=1
                    dosetot1 +=1
                    
                }
                if(dataState[i].data[j].nbDoses === 2){
                    dosetotal +=2
                    dosetot2 +=1
                }

                if(dataState[i].data[j].typeVaccin === "Moderna"){
                    moderna +=1
                }
                if(dataState[i].data[j].typeVaccin === "AstraZeneca"){
                    astraZeneca +=1
                }
                if(dataState[i].data[j].typeVaccin === "Pfizer"){
                    pfizer +=1
                }

                if(dataState[i].data[j].positif === false){
                    negatif +=1
                }
                if(dataState[i].data[j].positif === true){
                    positif +=1
                }

            }
        }

        //Affiche + Calcul + Arrondi Âge
        let total = dataState.length * dataState[0].data.length;
        let newTotAge = Math.round(moyage/total*10)/10
        setAge(newTotAge)

        //Affiche Homme / Femme
        setHomme(homme)
        setFemme(femme)

        //Affichage Nombre Total dose
        setDoseTotal(dosetotal)

        //Affichage Nombre Total 1ère dose / 2ème dose
        setDose1(dosetot1)
        setDose2(dosetot2)
        
        //Affichage Vaccins Moderna / AstraZeneca / Pfizer
        setModerna(moderna)
        setAstraZeneca(astraZeneca)
        setPfizer(pfizer)

        //Affichage test Positif / Négatif
        setPositif(positif)
        setNegatif(negatif)


        let newData = dataState[0].data[0]
        setDate(newData)
        if (data.positif === undefined){
            console.log("aaa")
        }
        console.log("test : ", data.positif)

        console.log("data =", dataState)
        let testdate = dataState[0].data[0].dateVaccination
        let date = new Date(testdate)
        console.log("date(timestamp) : ", dataState[0].data[0].dateVaccination)
        console.log("date : ", date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear())
        /* console.log("nbr =", dataState.length)
        console.log("H =", homme)
        console.log("F =", femme)
        console.log(Math.round(moyage/total));
        console.log("nbr2 =", dataState[0].data.length) */
    }, [dataState])

    return (
        <Fragment>
            <div className="header">
                <h3>Graphique - France</h3>
                <div className="choiceOption">
                    <input type="button" value="genre"/>
                    <input type="button" value="age"/>
                    <input type="button" value="date"/>
                </div>
            </div>
           
            <Graph age={age} totF={totF} totH={totH} totDose={totDose} totDose1={totDose1} totDose2={totDose2} moderna={moderna} astraZeneca={astraZeneca} pfizer={pfizer} positif={positif} negatif={negatif} />
            <div className="staticInfo">
                <div className="tiles">
                    <p>Homme / Femme</p>
                    <p>{data.length !== 0 && totH} / {data.length !== 0 && totF}</p>
                    <p>{data.positif === undefined ? "Nbr total dose administrée / 1ère / 2ème" : ""}</p>
                    <p>{data.positif === undefined ? totDose + " / " + totDose1 + " / " + totDose2 : ""}</p>

                </div>
                <div className="tiles">
                    <h2>Moyenne d'âge des patients</h2>
                    <h4>{data.length !== 0 && age}</h4>
                </div>
                <div className="tiles">
                    <h2> {data.positif === undefined ? "Vaccin utilisé Moderna / AstraZeneca / Pfizer" : "Test PCR Positif / Négatif"} </h2>
                    <h4>{data.positif === undefined ? moderna + " / " + astraZeneca + " / " + pfizer : positif + " / " + negatif}</h4>
                </div>
            </div>
                        
        </Fragment>
        
    )
}

export default Info;