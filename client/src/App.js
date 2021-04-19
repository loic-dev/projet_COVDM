//import logo from './logo.svg';
import { useState,useEffect } from 'react';
import './App.css';
import { SCREENING_CENTER, VACCINATION_CENTER } from './constants/state.constant';
import { loadData } from './Utils/api.util.js'
import MapBox from './components/map.component'
import Loader from './components/loader.component';



function App() {

    let initialState = {
        type:"pays",
        region:"",
        departement:"",
        center:"",
        centerGEOJSON:null,
        placeGEOJSON:null,
        CODV_data:null
    }





    const [typeCenter, setTypeCenter ] =  useState(VACCINATION_CENTER)
    const [mapState, setMapState] =  useState(initialState)
    const [mapLoading, setMapLoading ] = useState(true)

    


    useEffect(async () => {
        let send = {
            typeCenter:typeCenter,
            typePlace:mapState.type,
            codeRegion:mapState.region,
            codeDepartement:mapState.departement,
            id:mapState.center
        }
        let geojson = null;
        const data = await loadData(send);
        if(mapState.type === "departement" || mapState.type === "center"){
            geojson = {
                type: "FeatureCollection",
                features: []
            }
            let markers = data.data.data
            markers.forEach(marker => {
                let feature = {
                    type: "Feature",
                    properties: {
                        code_dep:marker.com_insee.toString().substr(0,2),
                        id:marker._id,
                        nom:marker.nom,
                        city:marker.com_nom
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [marker.long_coor1,marker.lat_coor1]
                    }
                }
                geojson.features.push(feature)
                
            }); 
        }
        setMapState({...mapState,placeGEOJSON:data.data.geoJSON,CODV_data:data.data.data,centerGEOJSON:geojson})
        
    }, [mapState.type,mapState.region,mapState.departement,mapState.center]);


    const showRegion = (code) => {
        setMapState({...mapState,type:"region",region:code,departement:"",center:""})
    }
    

    const showDepartement = async (code) => {
        setMapState({...mapState,type:"departement",region:"",departement:code,center:""})
    }

    const showPays = () => {
        setMapState({...mapState,type:"pays",departement:"",region:"",center:""})
    }

    const showCenter = (id) => {
        setMapState({...mapState,type:"center",departement:"",region:"",center:id})
    }



    const BackShow = ({}) => {
        console.log(mapState.type)
        switch (mapState.type) {
            case "region":
                return <button onClick={() => showPays()}>retour</button>
            case "departement":
                console.log(mapState.placeGEOJSON)
                if(mapState.placeGEOJSON.features.length > 0){
                    let code_region = mapState.placeGEOJSON.features[0].properties.code_region
                    return <button onClick={() => showRegion(code_region)}>retour</button>
                }
                
            case "center":
                let code_dep = mapState.centerGEOJSON.features[0].properties.code_dep
                return <button onClick={() => showDepartement(code_dep)}>retour</button>
            default:
                return;
        }
    }

    
   
    return (
        <div className="App">
            
            <div className="map d-flex">
                {mapState.type !== "pays" && <BackShow/>}
                {mapState.placeGEOJSON !== null && <MapBox showCenter={showCenter.bind(this)} setMapLoading={setMapLoading.bind(this)} mapState={mapState} showRegion={showRegion.bind(this)} showDepartement={showDepartement.bind(this)}  />}
                <div className={`info ${mapLoading === false ? "loaded" : ""}`}>
                    {mapLoading === true && <Loader/>}
                </div>
            </div>
        </div>)
  
}

export default App;
