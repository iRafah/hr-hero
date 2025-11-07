import axios from 'axios'

// Create an instance of Axios with the base URL.
const api = axios.create({
    baseURL: 'http://localhost:8000'
});

export default api