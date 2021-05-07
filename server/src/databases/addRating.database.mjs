import { db } from '../utils/database.util.mjs';
import { SCREENING_CENTER,VACCINATION_CENTER } from '../constants/database.constant.mjs';
import pkg from 'mongodb';
const { ObjectId } = pkg;

const addRatingDatabase = async (type,id,rating) => {
    switch (type) {
        case VACCINATION_CENTER:
            return await db.collection(VACCINATION_CENTER).updateOne({_id:new ObjectId(id)}, {$set: {"rating": rating}})
        case SCREENING_CENTER:
            return await db.collection(SCREENING_CENTER).updateOne({_id:new ObjectId(id)}, {$set: {"rating": rating}})
        default:
            break;
    }
} 

export default addRatingDatabase