import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

const form = document.querySelector('.form');
const input = form.querySelector('input');

// Показуємо привітання
iziToast.info({
  title: 'Hello',
  message: 'Please enter a search query',
  position: 'center',
});

// Ховаємо лоадер (за замовчуванням)
hideLoader();

// Обробник події для форми
form.addEventListener('submit', event => {
  event.preventDefault(); // Зупиняємо стандартне перезавантаження сторінки

  const query = input.value.trim(); // Отримуємо текст, введений користувачем
  console.log(query); // Виводимо запит у консоль

  // Якщо запит порожній
  if (!query) {
    console.log('Empty query detected');
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query correctly',
    });

    form.reset(); // Очищуємо форму
    clearGallery(); // Очищуємо галерею
    return; // Виходимо з функції
  }

  clearGallery(); // Очищуємо галерею перед новим пошуком
  showLoader(); // Показуємо лоадер

  // Запит до API
  fetchImages(query)
    .then(response => {
      const data = response.data;
      // console.log(data);

      // Якщо не знайдено результатів
      if (data.hits.length === 0) {
        iziToast.error({
          title: 'Error',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topLeft',
        });

        form.reset(); // Очищуємо форму
      } else {
        renderGallery(data.hits); // Відображаємо галерею
        form.reset(); // Очищуємо поле вводу після успішного пошуку
      }
    })
    // Якщо сталася помилка
    .catch(error => {
      console.log(error);
      iziToast.error({
        title: 'Error',
        message: `${error.message}`,
        position: 'topRight',
      });
    })
    .finally(() => {
      hideLoader(); // Ховаємо лоадер
    });
});
