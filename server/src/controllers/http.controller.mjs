import {GENERATE_DATA,LOAD_DATA,LOAD_CENTER , LOAD_LAYER} from '../constants/routes.constant.mjs';
import generateData from '../services/generateData.service.mjs';
import loadCenter from '../services/loadCenter.service.mjs';
import loadData from '../services/loadData.service.mjs';
import loadLayer from '../services/loadLayer.service.mjs';

export default function (app) {


    app.post(LOAD_CENTER, loadCenter)
    app.post(LOAD_DATA, loadData)
    app.post(LOAD_LAYER, loadLayer)
    app.post(GENERATE_DATA, generateData);

    







}