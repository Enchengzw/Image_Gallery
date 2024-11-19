const search = document.getElementById('search');
const bookmarked= document.getElementById('toggle-image');

function addImages(image_array) {
    for (let i = 0; i < image_array.length; i++) {
        const img = document.createElement('img');
        img.classList.add('gallery-item');
        let container = document.querySelector('.gallery');
        img.src = image_array[i].urls.full;
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
    if (toggleImage.src.includes('bookmark-untoggled')) {
        toggleImage.src = 'bookmark-toggled';  // Change to second image
      } else {
        toggleImage.src = 'bookmark-untoggled';  // Change back to first image
      }
}

fetch('/photos/random')
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

bookmarked.addEventListener('click', () => {
    toggleBookmark(this);
});

search.addEventListener('click', () => {
    let query = document.querySelector('input').value;
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    fetch(`/search/photos?query=${encodeURIComponent(query)}`)
    .then(response => {
    if (!response.ok)
        throw new Error('Failed to fetch data from API');
    return response.json();
    }).then(data => {
        addImages(data.results);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});
