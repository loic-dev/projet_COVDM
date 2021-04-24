import {loadCenterService} from './loadCenter.service.mjs';



const loadData = async (req,res) => {
    const {typeCenter,typePlace,codeRegion,codeDepartement,centerId} = req.body;
    return res.status(200).send({res:await loadCenterService(typeCenter,typePlace, "data", codeRegion,codeDepartement,centerId)})
}


export default loadData;