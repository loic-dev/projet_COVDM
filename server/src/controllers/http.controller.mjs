import { GET_VACCINATION_CENTER,GET_SCREENING_CENTER , GENERATE_DATA,LOAD_DATA } from '../constants/routes.constant.mjs';
import loadData from '../services/loadData.service.mjs';


export default function (app) {

    

    //app.get(GET_VACCINATION_CENTER, vaccinationCenter);
    //app.get(GET_SCREENING_CENTER,screeningCenter);

    app.post(LOAD_DATA, loadData)
    //sapp.post(GENERATE_DATA, generateData);
    







}