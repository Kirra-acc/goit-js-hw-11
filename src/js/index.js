import {getPhotos} from "./api.js";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const input = document.querySelector(".input");
const btnSearch = document.querySelector(".btnSearch");
const gallery = document.querySelector(".gallery");
const btnMore = document.querySelector(".load-more");

let page = 1;

let arrPhotos = [];
let totalPhotos = 0;
async function getData(userInput, page) {
    try {
        const response = await getPhotos(userInput, page)
        arrPhotos = response.hits;
        totalPhotos = response.totalHits;
        gallery.insertAdjacentHTML("beforeend", addCards(arrPhotos));
    } catch (error) {
        console.log(error);
        Notify.failure(`Oops. Something went wrong.`);
    }
}
function addCards(arrPhotos) {
    return arrPhotos.map(photo => {
        return `
        <div class="photo-card">
            <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
            <div class="info">
            <p class="info-item">
                <b>Likes ${photo.likes}</b>
            </p>
            <p class="info-item">
            <b>Views ${photo.views}</b>
            </p>
            <p class="info-item">
            <b>Comments ${photo.comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads ${photo.downloads}</b>
            </p>
            </div>
        </div>
        `
    });
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
    if (arrPhotos.length === 0) {
        Notify.info(
            `We're sorry, but you've reached the end of search results.`
        );
        btnMore.classList.add("is-hidden");
    } 
})
getPhotos()