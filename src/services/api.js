import axios from 'axios';

const api = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers:{
        'Content-Type':'application/json'
    }
});

// attach jwt token to protect API requests

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('hotelToken');

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;