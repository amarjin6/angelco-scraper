import axios from "axios";

class FilterService {
    getCSV = (values: any) => {
        const my_base_url = process.env.REACT_APP_BASE_URL;
        return axios.post(my_base_url + '/api/v1/parser/', values, {
            responseType: 'blob',
        });
    };
}

export default new FilterService();
