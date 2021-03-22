//import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import lieuxvaccin from "./data.json";

function App() {
  /* return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  ); */

  return (
    <div className="App">
      <h1>Coucou</h1>
      <MapContainer center={[43.604652, 1.444209]} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
        
      </MapContainer>
    </div>)
  
}

export default App;
