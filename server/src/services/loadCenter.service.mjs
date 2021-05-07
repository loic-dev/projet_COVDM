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
                switch (typeCenter) {
                    case "vaccinationCenter":
                        return centers.filter(center => depList.includes(center.com_insee.toString().substr(0,2)) == true);
                    case "screeningCenter":
                        if(codeRegion == "94"){
                            return centers.filter(center => center.adresse.match(/[0-9]{5,}/g)[0].substr(0,2) == "20");
                        } else {
                            return centers.filter(center => depList.includes(center.adresse.match(/[0-9]{5,}/g)[0].substr(0,2)) == true);
                        }
                        
                    default:
                        break;
                }
            case "departement":
                switch (typeCenter) {
                    
                    case "vaccinationCenter":
                        return centers.filter(center => [codeDepartement].includes(center.com_insee.toString().substr(0,2)) == true);
                    case "screeningCenter":
                        if(codeDepartement == "2A"){
                            return centers.filter(center => parseInt(center.adresse.match(/[0-9]{5,}/g)[0].substr(0,3)) < 202);
                        }
                        if(codeDepartement == "2B"){
                            return centers.filter(center => parseInt(center.adresse.match(/[0-9]{5,}/g)[0].substr(0,3)) >= 202);
                        }
                        return centers.filter(center => [codeDepartement].includes(center.adresse.match(/[0-9]{5,}/g)[0].substr(0,2)) == true);
                        
                    default:
                        break;
                }
            default:
                break;
        }
        
    }
}


const loadCenter = async (req,res) => {
    const {typeCenter,typePlace,codeRegion,codeDepartement,centerId} = req.body;
    let _center =  await loadCenterService(typeCenter,typePlace, "center", codeRegion,codeDepartement,centerId)
    if(centerId){
        //find one center
        let code_dep = typeCenter == "vaccinationCenter" ? _center[0].com_insee.toString().substr(0,2) : _center[0].adresse.match(/[0-9]{5,}/g)[0].substr(0,2)
        if(typeCenter !== "vaccinationCenter"){
            let d = _center[0].adresse.match(/[0-9]{5,}/g)[0].substr(0,3)
            if(parseInt(d) >= 200 && parseInt(d) < 202){
                code_dep = "2A"
            } else if(parseInt(code_dep) >= 202){
                code_dep = "2B"
            }
        }
        
        
        console.log(code_dep)
        let depart = departements.filter(d => d.code == code_dep)
        
        _center[0].name_dep = depart[0].name
        
    }

    console.log(_center)
    
    return res.status(200).send({res:_center})  
}

export default loadCenter;