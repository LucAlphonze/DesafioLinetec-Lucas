import axios from 'axios';

export const getAllData = async() => {
    const data = await axios({
        url: 'http://localhost:5000/data/all',
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        }
    });

    return data
}