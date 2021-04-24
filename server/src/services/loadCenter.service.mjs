import {loadCenterDatabase,loadCentersDatabase} from "../databases/loadCenter.database.mjs";
import departements from '../GEOJSON/departments.js'


export const loadCenterService = async (typeCenter,typePlace, typeResult, codeRegion,codeDepartement,centerId) => {
    //lister les codes des departement d'une region
    const listeDepartementOfRegion = async (codeRegion) => {
        let tab = []
        departements.forEach(dep => {
            if(dep.region_code == codeRegion){
                tab.push(dep.code);
            }
        })
        return tab;
    }


    if(centerId){
        //find one center
        return await loadCenterDatabase(typeCenter,centerId,typeResult)
    } else {
        //find multiple center 
        let centers = await loadCentersDatabase(typeCenter,typeResult)
        switch (typePlace) {
            case "pays":
                return centers
            case "region":
                let depList = await listeDepartementOfRegion(codeRegion)
                return centers.filter(center => depList.includes(center.com_insee.toString().substr(0,2)) == true);
            case "departement":
                return centers.filter(center => [codeDepartement].includes(center.com_insee.toString().substr(0,2)) == true);
            
            default:
                break;
        }
        
    }
}


const loadCenter = async (req,res) => {
    const {typeCenter,typePlace,codeRegion,codeDepartement,centerId} = req.body;
    return res.status(200).send({res:await loadCenterService(typeCenter,typePlace, "center", codeRegion,codeDepartement,centerId)})
}

export default loadCenter;