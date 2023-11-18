import axios from 'axios';

const API_KEY = "40738365-6a0e054f87c7a82a30c7ec6b7";
const BASE_URL = "https://pixabay.com/api/";

export async function getPhotos(userInput, page) {
    const param = new URLSearchParams({
        key: API_KEY,
        q: userInput,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      });
    const res = await axios.get(`${BASE_URL}?${param}`);
    console.log(res.data);
    return res.data;
}