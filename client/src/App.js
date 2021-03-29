//import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import MapBox from './components/map.component'



function App() {

    const [type, setType] =  useState("Region")
    
    const [region, setRegion] = useState("Occitanie")
    const [departement, setDepartement] = useState("tarn")
    const [centreVaccination, setCentreVaccination] = useState("hopital albi")

    const [, ] = useState()

   
  return (
    <div className="App">
        <div className="map">
            <MapBox/>
            

        </div>
      
      
    </div>)
  
}

export default App;
