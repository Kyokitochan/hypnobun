// Full-Screen Function
function goFullScreen() {
    const element = document.getElementById('fullscreen-container');
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Audio Start Function
function startAudio() {
    const audio = document.getElementById('background-audio');
    audio.volume = 0.5;
    audio.play().then(() => {
        document.getElementById('start-audio').style.display = 'none'; // Hide button on success
    }).catch(error => {
        console.error('Audio playback failed:', error);
    });
}

// Global array to store fetched image URLs
let imagePool = [];

// Fetch 50 Random Images from Rule34 with "verybadboye" tag
async function fetchRandomImages() {
    const url = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=50&tags=verybadboye';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const posts = data || [];

        if (posts.length === 0) throw new Error('No posts found for "verybadboye"');

        imagePool = posts.slice(0, 50).map(post => post.file_url);
        updatePageImages();
    } catch (error) {
        console.error('Error fetching images from Rule34:', error);
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            page.style.backgroundImage = `url(https://via.placeholder.com/1920x1080?text=Image+${index + 1})`;
        });
    }
}

// Update page backgrounds with random images from the pool
function updatePageImages() {
    const pages = document.querySelectorAll('.page');
    const usedIndices = new Set();

    pages.forEach(page => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * imagePool.length);
        } while (usedIndices.has(randomIndex) && usedIndices.size < imagePool.length);

        usedIndices.add(randomIndex);
        const imageUrl = imagePool[randomIndex] || 'https://via.placeholder.com/1920x1080?text=No+Image';
        page.style.backgroundImage = `url(${imageUrl})`;
    });
}

// Trigger full-screen, fetch images, and attempt audio playback
window.onload = function() {
    goFullScreen();
    fetchRandomImages();

    const audio = document.getElementById('background-audio');
    audio.volume = 0.5;
    
    // Attempt to play audio immediately
    audio.play().catch(error => {
        console.log('Auto-play blocked:', error);
        // Show fallback button if blocked
        document.getElementById('start-audio').style.display = 'block';
    });

    // Retry after full-screen (some browsers allow after user gesture like full-screen)
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            audio.play().catch(() => {
                document.getElementById('start-audio').style.display = 'block';
            });
        }
    });
};

// Page Switching with Image Refresh
const pages = document.querySelectorAll('.page');
let currentPage = 0;

function switchPage() {
    pages[currentPage].classList.remove('active');
    currentPage = (currentPage + 1) % pages.length;
    pages[currentPage].classList.add('active');

    if (currentPage === 0) {
        updatePageImages();
    }
}

setInterval(switchPage, 5000);

// Falling Words
const fallingWordsContainer = document.querySelector('.falling-words');
const words = ['Relax', 'Sink', 'Drift', 'Obey', 'Fall', 'Deep'];

function createFallingWord() {
    const word = document.createElement('div');
    word.classList.add('falling-word');
    word.textContent = words[Math.floor(Math.random() * words.length)];
    word.style.left = `${Math.random() * 100}vw`;
    word.style.animationDuration = `${Math.random() * 5 + 3}s`;
    fallingWordsContainer.appendChild(word);
    word.addEventListener('animationend', () => word.remove());
}

setInterval(createFallingWord, 1000);