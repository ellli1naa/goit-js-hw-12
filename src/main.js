import { fetchImages } from './js/pixabay-api.js';
import {
  renderImages,
  showError,
  clearGallery,
} from './js/render-functions.js';

const form = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('#loader');
const loadMoreBtn = document.querySelector('#load-more');

let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    showError('Please enter a search term.');
    return;
  }

  page = 1;
  clearGallery(galleryContainer);
  loadMoreBtn.style.display = 'none';
  showLoader();

  try {
    const { images, totalHits: hits } = await fetchImages(query, page);
    totalHits = hits;
    renderImages(images, galleryContainer);

    if (totalHits > 15) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    showError(
      'Sorry, there are no images matching your search query. Please try again!'
    );
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const { images } = await fetchImages(query, page);
    renderImages(images, galleryContainer);

    const totalLoadedImages = document.querySelectorAll('.gallery-item').length;
    if (totalLoadedImages >= totalHits) {
      loadMoreBtn.style.display = 'none';
      showError("We're sorry, but you've reached the end of search results.");
    }

    const { height: cardHeight } =
      galleryContainer.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    showError('Failed to load more images.');
  } finally {
    hideLoader();
  }
});

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}
