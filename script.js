function changeLanguage(language) {
    // Sample content object
    const slokaContent = {
        telugu: {
            sloka1: "తెలుగు వెర్షన్ ఇక్కడ...",
            // Add more slokas
        },
        english: {
            sloka1: "English version here...",
            // Add more slokas
        },
        malayalam: {
            sloka1: "മലയാളം പതിപ്പ് ഇവിടെ...",
            // Add more slokas
        }
    };

    const currentSloka = document.querySelector('.sloka-text');
    currentSloka.textContent = slokaContent[language].sloka1;
}

function playAudio(slokaId) {
    // Create audio element and play
    const audio = new Audio(`audio/${slokaId}.mp3`);
    audio.play();
} 