//import logo from './logo.svg';
import { useState,useEffect, Fragment ,useRef} from 'react';
import './App.css';
import { SCREENING_CENTER, VACCINATION_CENTER } from './constants/state.constant';
import { loadData, loadLayer, loadCenter } from './Utils/api.util.js'
import MapBox from './components/map.component'
import Loader from './components/loader.component';


import Info from './components/info.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'


function App() {

   
    let initMapState = {
        type:"pays",
        region:"",
        departement:"",
        centerId:"",
        markers:null,
        layers:null,
    }

    let initDataState = null



    const [typeCenter, setTypeCenter ] =  useState(VACCINATION_CENTER)
    const [mapState, setMapState] =  useState(initMapState)
    const [dataState,setDataState ] = useState(initDataState)
    const [dataStateInfo, setDataStateInfo]= useState(null)
    const [dataLoading, setDataLoading ] = useState(true) 
    const [mapLoading, setMapLoading ] = useState(true)


    const [infoDataLoading, setInfoDataLoading] = useState(true)


    


    const createMarker = async (centers) => {
        let markers = {
            type: "FeatureCollection",
            features: []
        }
        centers.forEach(center => {
            let feature;
            if(typeCenter === VACCINATION_CENTER){
                feature = {
                    type: "Feature",
                    properties: {
                        id:center._id,
                        code_dep:center.com_insee.toString().substr(0,2),
                        nom:center.nom,
                        adr_num:center.adr_num,
                        adr_voie:center.adr_voie,
                        com_cp:center.com_cp,
                        com_nom:center.com_nom,
                        lieu_accessibilite:center.lieu_accessibilite,
                        rdv_lundi:center.rdv_lundi,
                        rdv_mardi:center.rdv_mardi,
                        rdv_mercredi:center.rdv_mercredi,
                        rdv_jeudi:center.rdv_jeudi,
                        rdv_vendredi:center.rdv_vendredi,
                        rdv_samedi:center.rdv_samedi,
                        rdv_dimanche:center.rdv_dimanche,
                        date_ouverture:center.date_ouverture,
                        date_fermeture:center.date_fermeture,
                        rdv_site_web:center.rdv_site_web,
                        rdv_tel:center.rdv_tel,
                        rdv_tel2:center.rdv_tel2
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [center.long_coor1,center.lat_coor1]
                    } 
                }
            } else {
                let codeDep = center.adresse.match(/[0-9]{5,}/g)[0].substr(0,2)
                if(codeDep == "20"){
                    if(parseInt(center.adresse.match(/[0-9]{5,}/g)[0].substr(0,3)) < 202){
                        codeDep = "2A"
                    }
                    if(parseInt(center.adresse.match(/[0-9]{5,}/g)[0].substr(0,3)) >= 202){
                        codeDep = "2B"
                    }
                }
                feature = {
                    type: "Feature",
                    properties: {
                        id:center._id,
                        code_dep:codeDep,
                        nom:center.rs,
                        adresse:center.adresse,
                        do_prel:center.do_prel,
                        do_antigenic:center.do_antigenic,
                        mod_prel:center.mod_prel,
                        public:center.public,
                        horaire:center.horaire,
                        horaire_prio:center.horaire_prio,
                        check_rdv:center.check_rdv,
                        tel_rdv:center.tel_rdv,
                        web_rdv:center.web_rdv
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [parseFloat(center.longitude),parseFloat(center.latitude)]
                    } 
                }
            }
            markers.features.push(feature)
            
        }); 
        return markers;
    }

  


    const loadingDataMap = async () => {
        let send = {
            typeCenter:typeCenter,
            typePlace:mapState.type,
            codeRegion:mapState.region,
            codeDepartement:mapState.departement,
            centerId:mapState.centerId
        }

        let markers = {
            type: "FeatureCollection",
            features: []
        };
        let layers = {
            type: "FeatureCollection",
            features: []
        };

        if(mapState.type === "pays" || mapState.type === "region"){
            let responseLayer = await loadLayer(send)
            layers = responseLayer.data.res
        } else if (mapState.type === "departement"){
            let responseLayer = await loadLayer(send)
            layers = responseLayer.data.res
            let responseCenter = await loadCenter(send)
            let centers = responseCenter.data.res
            markers = await createMarker(centers)
        } else {
            let responseCenter = await loadCenter(send)
            let center = responseCenter.data.res
            markers = await createMarker(center)    
        }
        setMapState({...mapState,markers,layers})
    }

    const loadingData = async () => {
        
        let send = {
            typeCenter:typeCenter,
            typePlace:mapState.type,
            codeRegion:mapState.region,
            codeDepartement:mapState.departement,
            centerId:mapState.centerId
        }

        let responseData = await loadData(send)
        let data = responseData.data.res
        setDataState(data)
        let result = [];
        data.forEach((element) => {
            result = result.concat(element.data)
        })
        setDataStateInfo(result)
        setDataLoading(false)
    }


    useEffect(async () => {
        setInfoDataLoading(true)
        await loadingDataMap()
        await loadingData()
    }, [typeCenter,mapState.type,mapState.region,mapState.departement,mapState.centerId]);

    const showRegion = (code) => {
        setMapState({...mapState,type:"region",region:code,departement:"",centerId:""})
    }
    

    const showDepartement = async (code) => {
        setMapState({...mapState,type:"departement",region:"",departement:code,centerId:""})
    }

    const showPays = () => {
        setMapState({...mapState,type:"pays",departement:"",region:"",centerId:""})
    }

    const showCenter = (id) => {
        setMapState({...mapState,type:"center",departement:"",region:"",centerId:id})
    }



    const BackShow = ({}) => {
        switch (mapState.type) {
            case "region":
                return <div className="retourIconContainer" onClick={() => showPays()}>
                    <FontAwesomeIcon className="iconRetour" icon={faArrowLeft} />
                </div>
            case "departement":
                if(mapState.layers.features.length > 0){
                    let code_region = mapState.layers.features[0].properties.code_region
                    return <div className="retourIconContainer" onClick={() => showRegion(code_region)}> 
                        <FontAwesomeIcon className="iconRetour" icon={faArrowLeft} />
                    </div>
                }
            case "center":
                let code_dep = mapState.markers.features[0].properties.code_dep
                return <div className="retourIconContainer" onClick={() => showDepartement(code_dep)}>
                    <FontAwesomeIcon className="iconRetour" icon={faArrowLeft} />
                </div>
            default:
                return;
        }
    }


    const switchCenter = () => {
        if(typeCenter === VACCINATION_CENTER) {
            if(mapState.type === "center"){
                let code_dep = mapState.markers.features[0].properties.code_dep
                showDepartement(code_dep)
            }
            setTypeCenter(SCREENING_CENTER) 
        } else {
            if(mapState.type === "center"){
                let code_dep = mapState.markers.features[0].properties.code_dep
                showDepartement(code_dep)
            }
            setTypeCenter(VACCINATION_CENTER) 
        }
    }

   
    

   
    return (
        <div className="App">
            
            <div className="map d-flex">
                {mapState.type !== "pays" && <BackShow/>}
                {mapState.layers !== null && <MapBox typeCenter={typeCenter} showCenter={showCenter.bind(this)} setMapLoading={setMapLoading.bind(this)} mapState={mapState} showRegion={showRegion.bind(this)} showDepartement={showDepartement.bind(this)}  />}
                <div className={`info ${mapLoading === false ? "loaded" : ""}`}>
                    {mapLoading === true && <Loader type="first"/>}
                    {mapLoading === false && dataLoading === false &&

                        <Info dataState={dataStateInfo} infoDataLoading={infoDataLoading} setInfoDataLoading={setInfoDataLoading.bind(this)} switchCenter={switchCenter.bind(this)} typeCenter={typeCenter}/>
                    }
                </div>
            </div>
        </div>)
  
}

export default App;
