import axios from 'axios';

const API_KEY = '46858923-7c3fdcfc6a46f2062867c0871';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${page}`;

  try {
    const response = await axios.get(url);
    if (response.data.hits.length === 0) {
      throw new Error('No images found');
    }
    return {
      images: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    throw error;
  }
}
