
import React, {useEffect, useState, useRef, Fragment} from 'react'
import Tooltip from './tooltip.component'
import mapboxgl from 'mapbox-gl';
import "../styles/map.style.css"
import turf from "@turf/bbox";
import markerIcon from '../ressources/marker.png'
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/popup.style.css"
import { VACCINATION_CENTER } from '../constants/state.constant';



const MapBox = ({mapState,showRegion,showDepartement,showCenter,typeCenter,setMapLoading}) => {

    const [map, setMap] = useState(null);
    const [popupRef, setPopupRef] = useState(null)
    const mapContainer = useRef();
    const [tooltip, setTooltip ] = useState({
        state:false,
        position:{x:"", y:""},
        data:null,
    })
    var regionHover = null;

    
    const positionTooltip = (x,y) => {
        let left = x;
        let top = y-120;
        let bodySelector = document.querySelector('body')
        let clientWidth = bodySelector.clientWidth
        let mapWidth = (clientWidth*48)/100

        
        if(left+230 >= mapWidth){
            left=left-200
        }

        if(y-120 < 10){
            top = y+20
        }

        return {left,top};
    }



    mapboxgl.accessToken = 'pk.eyJ1IjoibG9pYy1kZXYiLCJhIjoiY2trd2t5ZGFrMXNiajJ3cGNlNzJ4Y3hiMyJ9.Varnuza9AJUEDYAah7q-jA';
    useEffect(() => {
        const mapbox = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v10',
            maxZoom: 10
        });

        setPopupRef(new mapboxgl.Popup({closeButton: false,
            closeOnClick: false}))
        setMap(mapbox);
        mapbox.on('load', () => {
            mapbox.addSource('place', {
                'type': 'geojson',
                'data':mapState.layers,
                'generateId': true 
            });

            

            mapbox.addLayer({
                'id': 'fill-region',
                'type': 'fill',
                'source': 'place', // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': 'rgb(41, 75, 184)', // blue color fill
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.5,
                        0.2]   
            }});
    
            mapbox.addLayer({
                'id': 'line-region',
                'type': 'line',
                'source': 'place',
                'layout': {},
                'paint': {
                    'line-color': 'rgb(41, 75, 184)',
                    'line-width': 3,
                    'line-opacity':0.8
            }});

            mapbox.loadImage(markerIcon,
                function (error, image) {
                    if (error) throw error;
                    mapbox.addImage('markerIcon', image);
                })

            mapbox.fitBounds(turf(mapState.layers), {padding: 100});
            setMapLoading(false);
                
            });
            
        return () => mapbox.remove();
    }, []);

  

    useEffect(() => {
        if(map){
            map.on('mousemove','fill-region',mouseMoveOnLayer)
            map.on('mouseleave','fill-region',mouseLeaveOnLayer)
            map.on('click','fill-region',clickOnLayer)
            map.on('mousemove','markers',mouseMoveOnMarker)
            map.on('mouseleave','markers',mouseLeaveOnMarker)
            map.on('click','markers',clickOnMarker)
            return () => {
                    map.off('mousemove','fill-region',mouseMoveOnLayer)
                    map.off('mouseleave','fill-region',mouseLeaveOnLayer)
                    map.off('click','fill-region',clickOnLayer)
                    map.off('mousemove','markers',mouseMoveOnMarker)
                    map.off('mouseleave','markers',mouseLeaveOnMarker)
                    map.off('click','markers',clickOnMarker)
                }
        }
        
    }, [map,mapState])


   

    





    const clickOnMarker = (e) => {
        mouseLeaveOnMarker()
        showCenter(e.features[0].properties.id)
        var coordinates = e.features[0].geometry.coordinates
        var properties = e.features[0].properties
        let contain = ``

        if(typeCenter == VACCINATION_CENTER){
            contain = `
            <div class="popup">
                <h3>${properties.nom}</h3>
                <p>${properties.adr_num} ${properties.adr_voie} ${properties.com_cp} ${properties.com_nom}</p>
                <p>${properties.lieu_accessibilite}<p>
                <h4>RDV</h4>
                <ul>
                    <li>Lundi : ${properties.rdv_lundi}</li>
                    <li>Mardi : ${properties.rdv_mardi}</li>
                    <li>Mercredi : ${properties.rdv_mercredi}</li>
                    <li>Jeudi : ${properties.rdv_jeudi}</li>
                    <li>Vendredi : ${properties.rdv_vendredi}</li>
                    <li>Samedi : ${properties.rdv_samedi}</li>
                    <li>Dimanche : ${properties.rdv_dimanche}</li>
                </ul>
                <p>Date d'ouverture : ${properties.date_ouverture}</p>
                ${properties.date_fermeture && `<p>Date de Fermeture : ${properties.date_fermeture}</p>`}
                <p>Site web : <a href="${properties.rdv_site_web}">Doctolib</a></p>
                <p>Telephone : ${properties.rdv_tel ? properties.rdv_tel : "non renseigné"}</p>
                ${properties.rdv_tel2 && `<p>Telephone 2 : ${properties.rdv_tel2}</p>`}
            </div>
        `
        } else {
           
            contain = `
            <div class="popup">
                <h3>${properties.nom}</h3>
                <p>${properties.adresse}</p>
                <p>Public : ${properties.public}</p>
                <p>Mode prelevement : ${properties.mod_prel} </p>
                <p>PCR : ${properties.do_prel}</p>
                <p>Antigéniqque : ${properties.do_antigenic}</p>
                <p>RDV : ${properties.check_rdv}</p>
                <h4>Horaire</h4>
                ${!properties.horaire ? "non renseigné" : 
                    `<p>${properties.horaire}</p>`
                }
                <h4>Horaire prioritaire</h4>
                ${!properties.horaire_prio ? "non renseigné" : 
                    `<p>${properties.horaire_prio}</p>`
                }
                <p>Site web : ${properties.web_rdv ? `<a href="${properties.web_rdv}">lien</a>`: "non renseigné"} </p>
                <p>Telephone : ${properties.tel_rdv ? properties.tel_rdv : "non renseigné"}</p>
            </div>
        `
        }


        
        
    
        if(popupRef === null){
            new mapboxgl.Popup({closeButton: false,
                closeOnClick: false}).setLngLat(coordinates).setHTML(contain).addTo(map);
        } else {
            popupRef.setLngLat(coordinates).setHTML(contain).addTo(map);
        }
    }


    const clickOnLayer = (e) => {
        mouseLeaveOnLayer();
        switch (mapState.type) {
            case "pays":
                showRegion(e.features[0].properties.code)
                break;
            case "region":
                showDepartement(e.features[0].properties.code)
                break;
            default:
                break;
        } 
    }

    const mouseMoveOnLayer = (e) => {
        let {left,top} = positionTooltip(e.originalEvent.clientX,e.originalEvent.clientY)
        setTooltip({
            state:true,
            position:{
                x:left,
                y:top
            },
            data:{type:"vaccination",name:e.features[0].properties.nom}
        })
        map.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
            if (regionHover !== null) {
                map.setFeatureState(
                    { source: 'place', id: regionHover },
                    { hover: false }
                );
            }
            regionHover = e.features[0].id;
            map.setFeatureState(
                { source: 'place', id: regionHover },
                { hover: true }
            );
        }

    }

    const mouseMoveOnMarker = (e) => {
        map.getCanvas().style.cursor = 'pointer';
        let {left,top} = positionTooltip(e.originalEvent.clientX,e.originalEvent.clientY)

  
        setTooltip({
            state:true,
            position:{
                x:left,
                y:top
            },
            data:{type:"vaccination",name:e.features[0].properties.nom}
        })
    }

    const mouseLeaveOnMarker = (e) => {
        map.getCanvas().style.cursor = 'default';
        setTooltip({
            state:false,
            position:{
                x:"",
                y:""
            },
            data:null
        })

    }




        
    const mouseLeaveOnLayer = () => {
        map.getCanvas().style.cursor = 'default';
        setTooltip({
            state:false,
            position:{
                x:"",
                y:""
            },
            data:null
        })

        if (regionHover !== null) {
            map.setFeatureState(
                { source: 'place', id:regionHover} ,
                { hover: false }
            );
        } 
        regionHover = null;
    }



    useEffect(() => {
        if(mapState.markers === null){
            if(map){
                if(map.getLayer("markers")){
                    map.removeLayer("markers")
                }
            }
        } else {
            if (map) {
                if(!map.getSource('marker')){
                    map.addSource('marker', {
                        'type': 'geojson',
                        'data':mapState.markers,
                        'generateId': true 
                    });
                } else {
                    map.getSource('marker').setData(mapState.markers);
                }
                if(mapState.type === "departement"){
                    if(!map.getLayer("markers")){
                        map.addLayer({
                            'id': 'markers',
                            'type': 'symbol',
                            'source': 'marker', // reference the data source
                            'layout': {
                                'icon-image': 'markerIcon', // reference the image
                                'icon-size': 1
                            }
                        });
                    }
                } else {
                    if(map.getLayer("markers")){
                        map.removeLayer("markers")
                    }
                    
                } 
                
                if(mapState.type === "center"){
                    let tu = turf(mapState.markers)
                    tu[1] = tu[1]+0.06
                    tu[3] = tu[3]+0.06
                    map.fitBounds(tu);
                     
                } else {
                    popupRef.remove()
                }
               
            }
        }
        
    }, [mapState.markers])




    useEffect(() => {
        if (map) {
            if(mapState.type === "departement"){
                if(map.getLayer("fill-region")){
                    map.removeLayer('fill-region');
                }
                if(!map.getLayer("line-region")){
                    map.addLayer({
                        'id': 'line-region',
                        'type': 'line',
                        'source': 'place',
                        'layout': {},
                        'paint': {
                            'line-color': 'rgb(41, 75, 184)',
                            'line-width': 3,
                            'line-opacity':0.8
                    }},'markers');
                }
            } else if(mapState.type === "center"){
                if(map.getLayer("fill-region")){
                    map.removeLayer('fill-region');
                }
                if(map.getLayer("line-region")){
                    map.removeLayer('line-region');
                }
                map.off('mousemove','markers',mouseMoveOnMarker)
                map.off('mouseleave','markers',mouseLeaveOnMarker)
                map.off('click','markers',clickOnMarker)
            } else {
                if(!map.getLayer("fill-region")){
                    map.addLayer({
                        'id': 'fill-region',
                        'type': 'fill',
                        'source': 'place', // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': 'rgb(41, 75, 184)', // blue color fill
                            'fill-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                0.5,
                                0.2]   
                    }});
                }
                if(!map.getLayer("line-region")){
                    map.addLayer({
                        'id': 'line-region',
                        'type': 'line',
                        'source': 'place',
                        'layout': {},
                        'paint': {
                            'line-color': 'rgb(41, 75, 184)',
                            'line-width': 3,
                            'line-opacity':0.8
                    }});
                }
            }

            if(mapState.type !== "center"){
                if(map.getSource('place')){
                    map.getSource('place').setData(mapState.layers);
                    map.fitBounds(turf(mapState.layers), {padding: 100});
                }
            }
            
            
            
        }
    }, [mapState.layers])



    

  
    return (
        <Fragment>
            <div id="mapbox" ref={mapContainer} />;
            {tooltip.state && <Tooltip 
                                        x={tooltip.position.x} 
                                        y={tooltip.position.y}
                                        data={tooltip.data} />}
            

        </Fragment>

    )
        

}

export default MapBox;


/*const initializeMap = ({ setMap, mapContainer }) => {
            

            var regionHover = null;

            map.on('load', function () {

                setMap(map);

                // Add a source for the state polygons.
                
                    
                   
                // Add a new layer to visualize the polygon.
                
                    
                // Change the cursor to a pointer when the mouse is over the states layer.
                map.on('mousemove', 'fill-region', function (e) {
                    
                })



                map.on('click', 'fill-region', function (e) {
                    
                    changeVue(e.features[0].properties.nom,[e.lngLat.lng,e.lngLat.lat])
                
                    /*switch (state.type) {
                        
                        case "regions":
                            showDepartments(e.features[0].properties.nom)
                            break;
                        

                    }
                    map.flyTo({
                        center: [e.lngLat.lng,e.lngLat.lat],
                        zoom:6.5
                    });
                });


            
        
                map.on('mouseleave', 'fill-region', function (e) {
                    
                });
          
            });
        };
  
      if (!map) initializeMap({ setMap, mapContainer, stateRef });*/





    