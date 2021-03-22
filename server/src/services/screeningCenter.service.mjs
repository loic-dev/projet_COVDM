import { db } from '../utils/database.util.mjs';
import { SCREENING_CENTER } from '../constants/database.constant.mjs';



const screeningCenter = async (req,res) => {
    const center = await db.collection(SCREENING_CENTER).find().toArray();
    return res.status(200).send(center); 
}

export default screeningCenter;

