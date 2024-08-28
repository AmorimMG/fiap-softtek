import axios from 'axios';
import Endpoints from './endpoints';

var baseURL = 'http://localhost:8080';

const instance = axios.create({
    baseURL: baseURL
});

const RESTAPI = {
    ...Endpoints(instance)
};

console.log(RESTAPI);

export { RESTAPI, baseURL };
export default instance;
