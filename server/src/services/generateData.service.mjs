import faker from 'faker'
import { db } from '../utils/database.util.mjs';
import { SCREENING_CENTER,VACCINATION_CENTER } from '../constants/database.constant.mjs';
import { VACCINATION } from '../constants/services.constant.mjs';



const generateDataVaccin =  () => {
    const data_COVD = []
    const genders = ["male", "female"];
    const timestamp = 1609459200000;
    let number = 5;
    let vaccins = ['Pfizer','Moderna','AstraZeneca']
    for(let i=0;i<=number;i++){
        let gender = genders[Math.floor(Math.random() * genders.length)]
        let dateRandom = Math.floor(Math.random() * (Date.now() - timestamp + 1)) + timestamp;
        let date = new Date(dateRandom);
        let random = Math.random()
        let center = {
            name:faker.name.firstName(gender),
            age:Math.floor(Math.random() * (90 - 55 + 1)) + 55,
            gender:gender,
            nbDoses:random <= 0.1 ? 2 : 1,
            typeVaccin:vaccins[Math.floor(Math.random() * vaccins.length)],
            dateVaccination:date.getTime()
        }
        data_COVD.push(center)
    }
    return data_COVD;
    

}

const generateData = async (req,res) => {
    const {type} = req.body;
    if(type === VACCINATION){
        const data =  generateDataVaccin()
        const result = await db.collection(VACCINATION_CENTER).updateMany({}, {$set: {"data": data}}, false, true)
    } else {

    }
    return res.status(200).send({res:"good"})
    
}

export default generateData
