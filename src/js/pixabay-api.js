import axios from 'axios';

const API_KEY = '49318399-651ca0146c73ba5cb36d392c8'; // Ключ API
const BASE_URL = 'https://pixabay.com/api/';

export function fetchImages(query) {
  const params = {
    key: API_KEY, // Ключ авторизації
    q: query, // Пошуковий запит
    image_type: 'photo', // Тип зображень
    orientation: 'horizontal', // Орієнтація
    safesearch: true, // Безпечний пошук
    per_page: 15, // Кількість результатів на сторінці
  };

  return axios.get(BASE_URL, { params }); // Виконуємо HTTP GET запит
}
