import loadDataDatabase from "../databases/loadData.database.mjs";
import loadDataGEOJSON from "./loadGeoJSON.service.mjs";
import departements from '../GEOJSON/departments.js'

const listeDepartementOfRegion = async (codeRegion) => {
    let tab = []
    departements.forEach(dep => {
        if(dep.region_code == codeRegion){
            tab.push(dep.code);
        }
    })
    return tab;
}


const loadData = async (req,res) => {
   
    const {typeCenter,typePlace,codeRegion,codeDepartement,id} = req.body;
    let geoJSON = await loadDataGEOJSON(typePlace,codeRegion,codeDepartement)
    let centers = await loadDataDatabase(typeCenter,id)

    
    let data;
    if(id){
        data = centers;
        return res.status(200).send({geoJSON:{
            type: "FeatureCollection",
            features: []
        },data});
    } else {
        switch (typePlace) {
            case "pays":
                data = centers
                return res.status(200).send({geoJSON,data});
            case "region":
                let depList = await listeDepartementOfRegion(codeRegion)
                data = centers.filter(center => depList.includes(center.com_insee.toString().substr(0,2)) == true);
                return res.status(200).send({geoJSON,data});
            case "departement":
                data = centers.filter(center => [codeDepartement].includes(center.com_insee.toString().substr(0,2)) == true);
                return res.status(200).send({geoJSON,data});
            default:
                break;
        }
        
    }
    
    




    




    /*const center = await db.collection(SCREENING_CENTER).find().toArray();
    return res.status(200).send(center); */
}


export default loadData;