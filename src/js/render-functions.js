import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
let lightbox = null;

// Функція для рендерингу галереї
export function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li>
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
          </a>
          <div class="info">
            <p><b>Likes:</b>${likes}</p>
            <p><b>Views:</b>${views}</p>
            <p><b>Comments:</b>${comments}</p>
            <p><b>Downloads:</b>${downloads}</p>
          </div>
        </li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  // Ініціалізація SimpleLightbox
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a');
  } else {
    lightbox.refresh();
  }
}

// Очищення галереї
export function clearGallery() {
  gallery.innerHTML = '';
}

// Показ/приховування лоадера
export function showLoader() {
  document.querySelector('.loader').style.display = 'block';
}

export function hideLoader() {
  document.querySelector('.loader').style.display = 'none';
}
// Плавне прокручування сторінки
export function scrollPage() {
  const { height } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
