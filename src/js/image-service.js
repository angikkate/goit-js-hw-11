import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34651867-a9ff37d4e5e76304c6c99ac31';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.per_page = 40;
        this.page = 1;
    }

    async fetchImages() {
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;

        try {
            const response = await axios.get(url);
            //console.log(this);
            this.incrementPage();
            //return response.data.hits;
            return response.data;
        } catch {
            Notify.info('Enter data to search!');
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