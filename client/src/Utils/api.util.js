import { host} from './hostConfig.util.js'
import axios from 'axios';


export const loadCenter = async (data) => {
    return  axios.post(`${host}/loadCenter`,data);
}

export const loadData = async (data) => {
    return  axios.post(`${host}/loadData`,data);
}

export const loadLayer = async (data) => {
    return  axios.post(`${host}/loadLayer`,data);
}

export const addRating_API = async (data) => {
    return  axios.post(`${host}/rating`,data);
}
