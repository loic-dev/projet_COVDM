
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import lieuxvaccin from "./../data.json";
import data from '../data.json'
import ReactMapboxGl, { GeoJSONLayer, Feature } from 'react-mapbox-gl';
 import 'mapbox-gl/dist/mapbox-gl.css';



const MapBox = ({}) => {


    const Map = ReactMapboxGl({
        accessToken:
          'pk.eyJ1IjoibG9pYy1kZXYiLCJhIjoiY2trd2t5ZGFrMXNiajJ3cGNlNzJ4Y3hiMyJ9.Varnuza9AJUEDYAah7q-jA'
    });


    return (
        <Map
            style="mapbox://styles/mapbox/light-v10"
            containerStyle={{
                height: '800px',
                width: '800px'
            }}
            center={[2.213749,46.227638]}
            zoom={[5]}>
        <GeoJSONLayer
            data={data}
            linePaint={{
                'line-color': 'rgb(97, 51, 255)',
                'line-width': 2
            }}
            fillPaint={{
                'fill-color':'rgba(97, 51, 255,0.2)'
            }}
        />
        </Map>
    )

    

    /*return (<MapContainer center={[43.604652, 1.444209]} zoom={12} scrollWheelZoom={false}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lieuxvaccin.map(data => (
            <Marker position = {[data.Coordonnees[0], data.Coordonnees[1]]}>
                <Popup>
                    <h2 className="App">{data.Nom}</h2>
                    <p className="App">{data.Prestation}</p>
                    <p className="App">{data.Tel}</p>
                </Popup>
            </Marker>
            ))}
            
        </MapContainer>)*/
}

export default MapBox;