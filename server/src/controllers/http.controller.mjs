import { GET_VACCINATION_CENTER,GET_SCREENING_CENTER , GENERATE_DATA } from '../constants/routes.constant.mjs';
import vaccinationCenter from '../services/vaccinationCenter.service.mjs';
import screeningCenter from '../services/screeningCenter.service.mjs';
import generateData from '../services/generateData.service.mjs';





export default function (app) {

    

    app.get(GET_VACCINATION_CENTER, vaccinationCenter);
    app.get(GET_SCREENING_CENTER,screeningCenter);
    //sapp.post(GENERATE_DATA, generateData);
    







}