
import React, {useEffect, useState, useRef, Fragment} from 'react'
import Tooltip from './tooltip.component'

import mapboxgl from 'mapbox-gl';
import "../styles/map.style.css"
import turf from "@turf/bbox";
import markerIcon from '../ressources/marker.png'



const MapBox = ({mapState,showRegion,showDepartement,showCenter, setMapLoading}) => {

    const [map, setMap] = useState(null);
    const mapContainer = useRef();
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
        setMap(mapbox);
        mapbox.on('load', () => {
            mapbox.addSource('place', {
                'type': 'geojson',
                'data':mapState.placeGEOJSON,
                'generateId': true 
            });

            mapbox.addLayer({
                'id': 'fill-region',
                'type': 'fill',
                'source': 'place', // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': 'rgb(97, 51, 255)', // blue color fill
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
                    'line-color': 'rgb(97, 51, 255)',
                    'line-width': 3,
                    'line-opacity':0.8
            }});

            mapbox.loadImage(markerIcon,
                function (error, image) {
                    if (error) throw error;
                    mapbox.addImage('markerIcon', image);
                })

            mapbox.fitBounds(turf(mapState.placeGEOJSON), {padding: 100});
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


    const [tooltip, setTooltip ] = useState({
        state:false,
        position:{x:"", y:""},
        data:null,
    })

    const [popup, setPopup ] = useState({
        state:false,
        position:{x:"", y:""},
        data:null,
    })



    const clickOnMarker = (e) => {
        mouseLeaveOnMarker()
        showCenter(e.features[0].properties.id)
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
        if(mapState.centerGEOJSON === null){
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
                        'data':mapState.centerGEOJSON,
                        'generateId': true 
                    });
                } else {
                    map.getSource('marker').setData(mapState.centerGEOJSON);
                }
                if(mapState.type === "departement" || mapState.type === "center"){
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
                let tu = turf(mapState.centerGEOJSON)
                tu[1] = tu[1]+0.03
                tu[3] = tu[3]+0.03
                map.fitBounds(tu);
                
            }
        }
        
    }, [mapState.centerGEOJSON])




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
                            'line-color': 'rgb(97, 51, 255)',
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
            } else {
                if(!map.getLayer("fill-region")){
                    map.addLayer({
                        'id': 'fill-region',
                        'type': 'fill',
                        'source': 'place', // reference the data source
                        'layout': {},
                        'paint': {
                            'fill-color': 'rgb(97, 51, 255)', // blue color fill
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
                            'line-color': 'rgb(97, 51, 255)',
                            'line-width': 3,
                            'line-opacity':0.8
                    }});
                }
            }

            if(mapState.type !== "center"){
                if(map.getSource('place')){
                    map.getSource('place').setData(mapState.placeGEOJSON);
                    map.fitBounds(turf(mapState.placeGEOJSON), {padding: 100});
                }
            }
            
            
            
        }
    }, [mapState.placeGEOJSON])





  
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





    