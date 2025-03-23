import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  scrollPage,
} from './js/render-functions';

const form = document.querySelector('.form');
const input = form.querySelector('input');
const loadMoreBtn = document.querySelector('.js-load-more');

// Номер сторінки
let currentPage = 1;

// Поточний запит
let currentQuery = '';

// Показуємо привітання
iziToast.info({
  title: 'Hello',
  message: 'Please enter a search query',
  position: 'center',
});

// Ховаємо кнопку (за замовчуванням)
loadMoreBtn.style.display = 'none';

// Ховаємо лоадер (за замовчуванням)
hideLoader();

// Обробник події для форми
form.addEventListener('submit', async event => {
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
    clearGallery(); // Ощищуємо форму
    return; // Виходимо з функції
  }
  currentQuery = query; // Зберігаємо пошуковий запит
  currentPage = 1; // Скидаємо номер сторінки
  clearGallery(); // Очищуємо галерею перед новим пошуком
  loadMoreBtn.style.display = 'none'; // Ховаємо кнопку перед новим пошуком
  showLoader(); // Показуємо лоадер

  try {
    // Запит до API
    const data = await fetchImages(currentQuery, currentPage);
    const { hits, totalHits } = data;
    console.log(data); // Що повернулося з запиту

    // Якщо не знайдено результатів
    if (hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topLeft',
      });
      form.reset(); // Очищуємо форму
    } else {
      renderGallery(hits); // Відображаємо галерею

      loadMoreBtn.style.display =
        data.hits.length < totalHits ? 'block' : 'none';
    }
  } catch (error) {
    // Якщо сталася помилка
    console.log(error);
    iziToast.error({
      title: 'Error',
      message: `${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader(); // Ховаємо лоадер
  }
});

// Обробник подій для кнопки "Load more"
loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1; // Збільшуємо номер сторінки
  try {
    const data = await fetchImages(currentQuery, currentPage);
    const { hits, totalHits } = data;

    renderGallery(hits); // Додаємо нові зображення до галереї
    scrollPage(); // Додаємо плавне прокручування після завантаження

    // Перевіряємо, чи є ще доступні зображення
    if (currentPage * 15 >= totalHits) {
      loadMoreBtn.style.display = 'none'; // Ховаємо кнопку
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'center',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `${error.message}`,
      position: 'topRight',
    });
  }
});
