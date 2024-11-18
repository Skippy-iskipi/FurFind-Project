import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const postPet = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/post-pet', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error);
        throw error.response?.data || error;
    }
}; 