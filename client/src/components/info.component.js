import Graph from './graph.component'
import {useEffect, Fragment, useState} from 'react'
import '../styles/info.style.css'

const Info = ({dataState}) => {

    const [data, setDate] = useState([])
    const [age, setAge] = useState([])
    const [totH, setHomme] = useState([])
    const [totF, setFemme] = useState([])

    
    useEffect(() => {
        let moyage = 0;
        let homme = 0;
        let femme = 0;
        for(let i = 0; i<dataState.length; i++){
            for(let j = 0; j<dataState[i].data.length; j++){
                moyage += dataState[i].data[j].age;

                if(dataState[i].data[j].gender === "female"){
                    femme +=1
                }
                if(dataState[i].data[j].gender === "male"){
                    homme +=1
                }

            }
        }

        //Affiche + Calcul + Arrondi Âge
        let total = dataState.length * dataState[0].data.length;
        let newTotAge = Math.round(moyage/total*10)/10
        setAge(newTotAge)

        //Affiche Homme / Femme
        let newtotH = homme
        let newtotF = femme
        setHomme(newtotH)
        setFemme(newtotF)

        let newData = dataState[0].data[0]
        setDate(newData)
        console.log("data =", dataState)
        console.log("H =", homme)
        console.log("F =", femme)
        /* console.log("nbr =", dataState.length)
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
           
            <Graph dataState={dataState}/>
            <div className="staticInfo">
                <div className="tiles">
                    <p>Homme : </p>
                    <p>{data.length !== 0 && totH}</p>
                    <p>Femme : </p>
                    <p>{data.length !== 0 && totF}</p>
                </div>
                <div className="tiles">
                    <h2>Moyenne d'âge des patients</h2>
                    <h3>{data.length !== 0 && age}</h3>
                </div>
            </div>
                        
        </Fragment>
        
    )
}

export default Info;