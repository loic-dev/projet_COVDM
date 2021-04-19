import { host} from './hostConfig.util.js'
import axios from 'axios';


export const loadData = async (data) => {
    return  axios.post(`${host}/loadData`,data);
}
