import './css/styles.css'
import axios from 'axios';
import Notiflix from 'notiflix';
import {ApiPixabay} from './js/searchImages';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    searchBtn: document.querySelector('.search-button'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}
let markup = '';

const apiPixabay = new ApiPixabay();

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
    try{
        e.preventDefault();

        apiPixabay.query = e.currentTarget.elements.searchQuery.value.trim();
        clearMarkup();
        if(apiPixabay.query === '') {
            hideButton();
            Notiflix.Notify.failure('You entered an empty value! Please fill the field.');
        } else {
            apiPixabay.resetPage();
            const result = await apiPixabay.searchImages();
            renderMarkup(result);
            Notiflix.Notify.success(`Hooray! We found ${apiPixabay.totalHits} images.`);
            showButton();  
            console.log(result);
        }
        
    } catch (error) {
        console.error(error);
    }
}

refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onLoadMore() {
    try {
        const result = await apiPixabay.searchImages();
        renderMarkup(result);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

function renderMarkup(images) {
    if(images.length === 0) {
        hideButton();
        clearMarkup();
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
        markup = images.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {return `
        <div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b><span>Likes</span></br>${likes}</b>
          </p>
          <p class="info-item">
            <b><span>Views</span></br>${views}</b>
          </p>
          <p class="info-item">
            <b><span>Comments</span></br>${comments}</b>
          </p>
          <p class="info-item">
            <b><span>Downloads</span></br>${downloads}</b>
          </p>
        </div>
      </div>`}).join('');
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      gallery.refresh();

      if (apiPixabay.page === Math.ceil(apiPixabay.totalHits/40)) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        hideButton();
      }
    }
    }

    function clearMarkup() {
        refs.gallery.innerHTML='';
    }

    function hideButton() {
        refs.loadMoreBtn.classList.add('disabled');
    }

    function showButton() {
        if(apiPixabay.totalHits>40) {
            refs.loadMoreBtn.classList.remove('disabled')
        } else {
            refs.loadMoreBtn.classList.add('disabled');
        }
    }

    let gallery = new SimpleLightbox('.gallery a');
    gallery.on('show.simplelightbox', function () {
        // do something…
    });