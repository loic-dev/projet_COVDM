import addRatingDatabase from "../databases/addRating.database.mjs";
import {loadCenterDatabase} from "../databases/loadCenter.database.mjs";


const addRating = async (req,res) => {
    const {centerId, typeCenter, name,surname,email,comment,score,waiting} = req.body;

    let rating = {
        name,
        surname,
        email,
        comment,
        score,
        waiting
    }



    let center = await loadCenterDatabase(typeCenter,centerId,"center")
    let get_rating = center[0].rating

    


    if(get_rating.findIndex(r => r.email == email) != -1){
    
        return res.status(200).send({err:"email"})
    }

    get_rating.push(rating)

    await addRatingDatabase(typeCenter,centerId,get_rating)


    return res.status(200).send({res:"good"})

}

export default addRating;