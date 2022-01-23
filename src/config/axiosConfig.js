import axios from "axios";

export default axios.create({
    baseURL: `https://opendata.cwb.gov.tw/api/v1/rest/datastore`
});