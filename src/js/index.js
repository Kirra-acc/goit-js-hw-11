import {getPhotos} from "./api.js";
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const input = document.querySelector(".input");
const gallery = document.querySelector(".gallery");
const btnMore = document.querySelector(".load-more");

let page = 1;
let arrPhotos = [];
let totalPhotos = 0;
async function getData(userInput, page) {
    try {
        const response = await getPhotos(userInput, page);
        arrPhotos = response.hits;
        totalPhotos = response.totalHits;
        gallery.insertAdjacentHTML("beforeend", addCards(arrPhotos));
        const lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
        });
    } catch (error) {
        console.log(error);
        Notify.failure(`Oops. Something went wrong.`);
    }
}
function addCards(arrPhotos) {
    return arrPhotos.map(photo => {
        return `
        <a class="photo-card" href="${photo.largeImageURL}">
            <img class="card-img" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
            <div class="info">
            <p class="info-item">
                <b>Likes</b>
                <b>${photo.likes}</b>
            </p>
            <p class="info-item">
                <b>Views</b>
                <b>${photo.views}</b>
            </p>
            <p class="info-item">
                <b>Comments</b>
                <b>${photo.comments}</b>
            </p>
            <p class="info-item">
                <b>Downloads</b>
                <b>${photo.downloads}</b>
            </p>
            </div>
        </a>
        `
    }).join('');
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    gallery.innerHTML = "";
    page = 1;

    userInput = input.value;
    await getData(userInput, page);
    if (arrPhotos.length === 0) {
        Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
        btnMore.classList.add("is-hidden");
    } else {
        Notify.success(
            `Hooray! We found ${totalPhotos} images.`
        );
        btnMore.classList.remove("is-hidden");
    }
})

btnMore.addEventListener("click", async () => {
    page += 1;
    console.log(page);
    await getData(userInput, page);
    smoothScroll();
    if (arrPhotos.length === 0) {
        Notify.info(
            `We're sorry, but you've reached the end of search results.`
        );
        btnMore.classList.add("is-hidden");
    } 
})
// Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.

function smoothScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
}
