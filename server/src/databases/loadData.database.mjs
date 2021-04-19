import { db } from '../utils/database.util.mjs';
import { SCREENING_CENTER,VACCINATION_CENTER } from '../constants/database.constant.mjs';
import pkg from 'mongodb';
const { ObjectId } = pkg;

const loadDataDatabase = async (type,id) => {
    if(type === VACCINATION_CENTER){
        if(id){
            return await db.collection(VACCINATION_CENTER).find({_id:new ObjectId(id)}).toArray();
        } else {
            return await db.collection(VACCINATION_CENTER).find().toArray();
        }
        
    } else {
        return await db.collection(SCREENING_CENTER).find().toArray();
    }
}



export default loadDataDatabase;