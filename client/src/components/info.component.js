import Graph from './graph.component'
import {useEffect, Fragment} from 'react'
import '../styles/info.style.css'

const Info = ({dataState}) => {

    
    useEffect(() => {
        
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
                </div>
                <div className="tiles">

                </div>
            </div>
                        
        </Fragment>
        
    )
}

export default Info;