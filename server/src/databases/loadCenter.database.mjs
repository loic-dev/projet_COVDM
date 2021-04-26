import { db } from '../utils/database.util.mjs';
import { SCREENING_CENTER,VACCINATION_CENTER } from '../constants/database.constant.mjs';
import pkg from 'mongodb';
const { ObjectId } = pkg;

export const loadCenterDatabase = async (type,id,typeResult) => {
    switch (type) {
        case VACCINATION_CENTER:
            if(typeResult == "data"){
                return await db.collection(VACCINATION_CENTER).find({_id:new ObjectId(id)}).project({_id:1,com_insee:1,data:1}).toArray();
            } else {
                return await db.collection(VACCINATION_CENTER).find({_id:new ObjectId(id)}).project({_id:1,nom:1,adr_num:1,adr_voie:1,com_cp:1,com_insee:1,com_nom:1,lat_coor1:1,long_coor1:1,lieu_accessibilite:1,rdv_lundi:1,rdv_mardi:1,rdv_mercredi:1,rdv_jeudi:1,rdv_vendredi:1,rdv_samedi:1,rdv_dimanche:1,date_fermeture:1,date_ouverture:1,rdv_site_web:1,rdv_tel:1,rdv_tel2:1}).toArray();
            }
        case SCREENING_CENTER:
            if(typeResult == "data"){
                return await db.collection(SCREENING_CENTER).find({_id:new ObjectId(id)}).project({_id:1,adresse:1,data:1}).toArray();
            } else {
                return await db.collection(SCREENING_CENTER).find({_id:new ObjectId(id)}).project({_id:1,rs:1,adresse:1,do_prel:1,do_antigenic:1,longitude:1,latitude:1,mod_prel:1,public:1,horaire:1,horaire_prio:1,check_rdv:1,tel_rdv:1,web_rdv:1}).toArray();
            }
        
            
        default:
            break;
    }
} 

export const loadCentersDatabase = async (type,typeResult) => {
    switch (type) {
        case VACCINATION_CENTER:
            if(typeResult == "data"){
                return await db.collection(VACCINATION_CENTER).find({}).project({_id:1,com_insee:1,data:1}).toArray();
            } else {
                return await db.collection(VACCINATION_CENTER).find({}).project({_id:1,nom:1,adr_num:1,adr_voie:1,com_cp:1,com_insee:1,com_nom:1,lat_coor1:1,   long_coor1:1,lieu_accessibilite:1,rdv_lundi:1,rdv_mardi:1,rdv_mercredi:1,rdv_jeudi:1,rdv_vendredi:1,rdv_samedi:1,rdv_dimanche:1,date_fermeture:1,date_ouverture:1,rdv_site_web:1,rdv_tel:1,rdv_tel2:1}).toArray();
            }
        case SCREENING_CENTER:
            if(typeResult == "data"){
                return await db.collection(SCREENING_CENTER).find({}).project({_id:1,adresse:1,data:1}).toArray();
            } else {
                return await db.collection(SCREENING_CENTER).find({}).project({_id:1,rs:1,adresse:1,do_prel:1,do_antigenic:1,longitude:1,latitude:1,mod_prel:1,public:1,horaire:1,horaire_prio:1,check_rdv:1,tel_rdv:1,web_rdv:1}).toArray();
            }
            
        default:
            break;
    }
}