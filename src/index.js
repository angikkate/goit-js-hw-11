import { refs } from './js/refs';
import { createMarkup } from './js/createMarkup';

import ImagesApiService from './js/image-service';
import LoadMoreBtn from './js/components/load-more-btn';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

const imagesApiService = new ImagesApiService;

let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
    e.preventDefault();
    
    imagesApiService.query = e.currentTarget.elements.searchQuery.value;

    if (!imagesApiService.query) {
        imagesApiService.resetPage();
        Notify.info('Enter data to search!');
        return;
    }

    loadMoreBtn.show();
    imagesApiService.resetPage();
    clearGallaryContainer();
    fetchImages();
}

function fetchImages() {
    loadMoreBtn.disable();
    imagesApiService.fetchImages().then(response => {

        try {
            if (response.totalHits > 0) {
              Notify.success(`Hooray! We found ${response.totalHits} images.`);
              
              lightbox.refresh();
              appendMarkup(response.hits);
              loadMoreBtn.enable();
            }
        
            if (response.totalHits === 0) {
                clearGallaryContainer();
              Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
          } catch (error) {
            console.log(error);
          }
    });
    
}

function appendMarkup(images) {
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(images));
}

function clearGallaryContainer() {
    refs.gallery.innerHTML = '';
}