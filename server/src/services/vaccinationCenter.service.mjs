import { db } from '../utils/database.util.mjs';
import { VACCINATION_CENTER } from '../constants/database.constant.mjs';



const vaccinationCenter = async (req,res) => {
    const center = await db.collection(VACCINATION_CENTER).find().toArray();
    return res.status(200).send(center);   
}

export default vaccinationCenter;