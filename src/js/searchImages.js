import axios from 'axios';
import Notiflix from 'notiflix';

const PATH = 'https://pixabay.com/api/';
const API_KEY = '35879877-b74113ef6df41c53318af8ed1';
const imageType = 'photo';
const imageOrientation = 'horizontal';
const safeSearch = true;

class ApiPixabay {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.totalHits = 0;
    }
    
    async searchImages() {
        const url = `${PATH}?key=${API_KEY}&q=${this.searchQuery}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}&page=${this.page}&per_page=40`;
        try {
          const response = await axios.get(url);
          this.incrementPage();
          this.totalHits = response.data.totalHits;
          console.log(this.totalHits);
          return response.data.hits;
        } catch (error) {
          console.error(error);
        }
      }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

export {ApiPixabay};