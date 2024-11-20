const search = document.getElementById('search');
const bookmarked = document.getElementById('toggled');
let page_counter = 1;
let query = document.querySelector('input');
const  page = document.querySelector('.page');

function CreateImageElement(url) {
    let container = document.createElement('div');
    container.classList.add('image-container');
        
    const img = document.createElement('img');
    img.src = url;
    img.classList.add('url-img');

    const bookmark = document.createElement('img');
    bookmark.src = 'Images/bookmark-untoggled.svg';
    bookmark.addEventListener('click', () => {
    toggleBookmark(bookmark);
    });
    bookmark.classList.add('img-logo');
    
    container.appendChild(img);
    container.appendChild(bookmark);
    return container;
}
    
function addImages(image_array) {
    for (let i = 0; i < image_array.length; i++) { 
    let container = document.querySelector('.gallery');
    let img = CreateImageElement(image_array[i].urls.full);
    container.appendChild(img);
    }
}

function clearImages() {
    let container = document.querySelector('.gallery');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function toggleBookmark(image) {
    if (image.src.includes('Images/bookmark-untoggled.svg')) {
        image.src = 'Images/bookmark-toggled.svg';  // Change to second image
      } else {
        image.src = 'Images/bookmark-untoggled.svg';  // Change back to first image
      }
}

function addRandomImages(number = 1) {
    fetch(`/photos/random?page=${number}`)
    .then(response => {
        if (!response.ok)
            throw new Error('Failed to fetch data from API');
        return response.json();
     }).then(data => {
        addImages(data);
     }
    ).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function addFilteredImages(number = 1) {
    if (!query.value) {
        alert('Please enter a search term');
        return;
    }

    clearImages();
    fetch(`/search/photos?query=${encodeURIComponent(query)}&page=${number}`)
    .then(response => {
    if (!response.ok)
        throw new Error('Failed to fetch data from API');
    return response.json();
    }).then(data => {
        addImages(data.results);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

bookmarked.addEventListener('click', () => {
    toggleBookmark(bookmarked);
});

search.addEventListener('click', () => {
    page_counter = 1;
    addFilteredImages();
});

page.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        page_counter++;
        if (query.value)
            addFilteredImages(page_counter);
        else
            addRandomImages(page_counter);
    }
    console.log("Goodbye");
});

addRandomImages();
