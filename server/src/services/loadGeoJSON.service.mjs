import pays from '../GEOJSON/pays.js'
import departements from '../GEOJSON/departments.js'
import occitanie_GEOJSON  from '../GEOJSON/occitanie/occitanie.js';
import nouvelleAquitaine_GEOJSON from '../GEOJSON/nouvelleAquitaine/nouvelleAquitaine.js';
import provenceAlpesCoteAzur_GEOJSON from '../GEOJSON/provenceAlpesCoteAzur/provenceAlpesCoteAzur.js';
import paysDeLaLoire_GEOJSON from '../GEOJSON/paysDelaLoire/paysDeLaLoire.js'
import normandie_GEOJSON from '../GEOJSON/normandie/normandie.js';
import ileDeFrance_GEOJSON from '../GEOJSON/ileDeFrance/ileDeFrance.js';
import hautsDeFrance_GEOJSON from '../GEOJSON/hautsDeFrance/hautsDeFrance.js';
import grandEst_GEOJSON from '../GEOJSON/grandEst/grandEst.js';
import corse_GEOJSON from '../GEOJSON/corse/corse.js';
import centreValDeLoire_GEOJSON from '../GEOJSON/centreValDeLoire/centreValDeLoire.js';
import bretagne_GEOJSON from '../GEOJSON/bretagne/bretagne.js';
import bourgogneFranceComte_GEOJSON from '../GEOJSON/bourgogneFranceComte/bourgogneFranceComte.js';
import auvergneRhoneAlpes_GEOJSON from '../GEOJSON/auvergneRhoneAlpes/auvergneRhoneAlpes.js';




const loadRegion = async (codeRegion) => {
    switch (codeRegion) {
        case "76":
            return occitanie_GEOJSON;
        case "75":
            return nouvelleAquitaine_GEOJSON;
        case "93":
            return provenceAlpesCoteAzur_GEOJSON;
        case "52":
            return paysDeLaLoire_GEOJSON;
        case "28":
            return normandie_GEOJSON;
        case "11":
            return ileDeFrance_GEOJSON;
        case "32":
            return hautsDeFrance_GEOJSON;
        case "94":
            return corse_GEOJSON;
        case "84":
            return auvergneRhoneAlpes_GEOJSON;
        case "53":
            return bretagne_GEOJSON;
        case "27":
            return bourgogneFranceComte_GEOJSON;
        case "24":
            return centreValDeLoire_GEOJSON;
        case "44":
            return grandEst_GEOJSON;
        default:
            break;
    }
}


const loadDepartement = async (codeDepartement) => {
    console.log(codeDepartement)
    let codeRegion = departements.filter(dep => dep.code.toString() === codeDepartement.toString())[0].region_code
    let region = await loadRegion(codeRegion)
    let departementIndex = region.features.findIndex(feat => feat.properties.code == codeDepartement.toString())
    region.features[departementIndex].properties.code_region = codeRegion;
    let geoJSON = {
        type: 'FeatureCollection',
        features: [region.features[departementIndex]]
    }
    return geoJSON;
    
}







const loadDataGEOJSON = (type,codeRegion,codeDepartement) => {
    switch (type) {
        case "pays":
            return pays;
        case "region":
            return loadRegion(codeRegion);
        case "departement":
            return loadDepartement(codeDepartement)
        default:
            break;
    }
}

export default loadDataGEOJSON;