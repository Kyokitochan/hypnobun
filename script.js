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

// Audio Handling
function initializeAudio() {
    const audio = document.getElementById('background-audio');
    audio.volume = 0.5;
    audio.src = 'hypno.mp3';
    audio.loop = true; // Ensure audio loops
    
    // Function to attempt playing audio
    function playAudio() {
        audio.play()
            .then(() => {
                console.log('Audio playing successfully');
                document.getElementById('start-audio').style.display = 'none';
            })
            .catch(error => {
                console.error('Audio playback failed:', error);
                document.getElementById('start-audio').style.display = 'block';
            });
    }

    // Add click event listener to the entire document
    document.addEventListener('click', function handleFirstClick() {
        playAudio();
        // Remove the event listener after first successful play attempt
        document.removeEventListener('click', handleFirstClick);
    });
}

// Global array to store fetched image URLs
let imagePool = [];

// Fetch 50 Random Images from Rule34 with "chastity_cage" tag
async function fetchRandomImages() {
    const url = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=50&tags=chastity_cage';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const posts = data || [];

        if (posts.length === 0) throw new Error('No posts found for "chastity_cage"');

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